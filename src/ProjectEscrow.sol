// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/utils/ReentrancyGuard.sol";
import "./UserRegistry.sol";

/**
 * @title ProjectEscrow
 * @notice Manages stablecoin escrow for freelance projects
 * @dev Implements Fair Work Protocol with milestone-based payments
 */
contract ProjectEscrow is ReentrancyGuard {
    // ============ State Variables ============
    
    IERC20 public immutable stablecoin;
    UserRegistry public immutable userRegistry;
    address public disputeJuryAddress;
    
    uint256 public constant MIN_MILESTONES = 3;
    uint256 public projectCounter;
    
    enum MilestoneStatus {
        Pending,
        Completed,
        Approved,
        Disputed,
        Released
    }
    
    struct Milestone {
        uint256 amount;
        string description;
        MilestoneStatus status;
        uint256 completedAt;
    }
    
    struct Project {
        address client;
        address freelancer;
        uint256 totalAmount;
        uint256 releasedAmount;
        Milestone[] milestones;
        bool isActive;
        uint256 createdAt;
    }
    
    // ============ Storage ============
    
    mapping(uint256 => Project) public projects;
    
    // ============ Events ============
    
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed client,
        address indexed freelancer,
        uint256 totalAmount,
        uint256 milestoneCount
    );
    event MilestoneCompleted(uint256 indexed projectId, uint256 milestoneIndex);
    event MilestoneApproved(uint256 indexed projectId, uint256 milestoneIndex, uint256 amount);
    event MilestoneDisputed(uint256 indexed projectId, uint256 milestoneIndex);
    event DisputeResolved(uint256 indexed projectId, uint256 milestoneIndex, uint256 freelancerAmount, uint256 juryAmount);
    event FundsReleased(uint256 indexed projectId, address indexed recipient, uint256 amount);
    
    // ============ Errors ============
    
    error InvalidMilestoneCount();
    error InvalidAmount();
    error UnauthorizedAccess();
    error InvalidStatus();
    error ProjectNotActive();
    error DisputeJuryNotSet();
    error TransferFailed();
    
    // ============ Constructor ============
    
    constructor(address _stablecoin, address _userRegistry) {
        stablecoin = IERC20(_stablecoin);
        userRegistry = UserRegistry(_userRegistry);
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Create a new project with escrow
     * @param freelancer Address of the freelancer
     * @param milestoneAmounts Array of milestone amounts
     * @param milestoneDescriptions Array of milestone descriptions
     */
    function createProject(
        address freelancer,
        uint256[] calldata milestoneAmounts,
        string[] calldata milestoneDescriptions
    ) external nonReentrant returns (uint256) {
        if (milestoneAmounts.length < MIN_MILESTONES) {
            revert InvalidMilestoneCount();
        }
        if (milestoneAmounts.length != milestoneDescriptions.length) {
            revert InvalidMilestoneCount();
        }
        
        // Calculate total amount
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            if (milestoneAmounts[i] == 0) {
                revert InvalidAmount();
            }
            totalAmount += milestoneAmounts[i];
        }
        
        // Transfer funds to escrow
        require(
            stablecoin.transferFrom(msg.sender, address(this), totalAmount),
            "Transfer failed"
        );
        
        // Create project
        uint256 projectId = projectCounter++;
        Project storage project = projects[projectId];
        project.client = msg.sender;
        project.freelancer = freelancer;
        project.totalAmount = totalAmount;
        project.releasedAmount = 0;
        project.isActive = true;
        project.createdAt = block.timestamp;
        
        // Create milestones
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            project.milestones.push(Milestone({
                amount: milestoneAmounts[i],
                description: milestoneDescriptions[i],
                status: MilestoneStatus.Pending,
                completedAt: 0
            }));
        }
        
        emit ProjectCreated(
            projectId,
            msg.sender,
            freelancer,
            totalAmount,
            milestoneAmounts.length
        );
        
        return projectId;
    }
    
    /**
     * @notice Freelancer marks milestone as completed
     */
    function completeMilestone(uint256 projectId, uint256 milestoneIndex) external {
        Project storage project = projects[projectId];
        
        if (!project.isActive) revert ProjectNotActive();
        if (msg.sender != project.freelancer) revert UnauthorizedAccess();
        if (milestoneIndex >= project.milestones.length) revert InvalidStatus();
        
        Milestone storage milestone = project.milestones[milestoneIndex];
        if (milestone.status != MilestoneStatus.Pending) {
            revert InvalidStatus();
        }
        
        milestone.status = MilestoneStatus.Completed;
        milestone.completedAt = block.timestamp;
        
        emit MilestoneCompleted(projectId, milestoneIndex);
    }
    
    /**
     * @notice Client approves milestone and releases payment
     */
    function approveMilestone(uint256 projectId, uint256 milestoneIndex) external nonReentrant {
        Project storage project = projects[projectId];
        
        if (!project.isActive) revert ProjectNotActive();
        if (msg.sender != project.client) revert UnauthorizedAccess();
        if (milestoneIndex >= project.milestones.length) revert InvalidStatus();
        
        Milestone storage milestone = project.milestones[milestoneIndex];
        if (milestone.status != MilestoneStatus.Completed) {
            revert InvalidStatus();
        }
        
        milestone.status = MilestoneStatus.Approved;
        
        // Release payment to freelancer
        uint256 amount = milestone.amount;
        project.releasedAmount += amount;
        
        require(
            stablecoin.transfer(project.freelancer, amount),
            "Transfer failed"
        );
        
        milestone.status = MilestoneStatus.Released;
        
        emit MilestoneApproved(projectId, milestoneIndex, amount);
        emit FundsReleased(projectId, project.freelancer, amount);
    }
    
    /**
     * @notice Client disputes a milestone (Fair Work Protocol)
     * @dev Splits funds: 30% instant to freelancer, 70% to jury
     */
    function disputeMilestone(uint256 projectId, uint256 milestoneIndex) external nonReentrant {
        if (disputeJuryAddress == address(0)) revert DisputeJuryNotSet();
        
        Project storage project = projects[projectId];
        
        if (!project.isActive) revert ProjectNotActive();
        if (msg.sender != project.client) revert UnauthorizedAccess();
        if (milestoneIndex >= project.milestones.length) revert InvalidStatus();
        
        Milestone storage milestone = project.milestones[milestoneIndex];
        if (milestone.status != MilestoneStatus.Completed) {
            revert InvalidStatus();
        }
        
        milestone.status = MilestoneStatus.Disputed;
        
        uint256 totalAmount = milestone.amount;
        uint256 freelancerAmount = (totalAmount * 30) / 100; // 30% instant release
        uint256 juryAmount = totalAmount - freelancerAmount; // 70% to jury
        
        project.releasedAmount += totalAmount;
        
        // Transfer 30% to freelancer immediately
        require(
            stablecoin.transfer(project.freelancer, freelancerAmount),
            "Freelancer transfer failed"
        );
        
        // Transfer 70% to DisputeJury contract
        require(
            stablecoin.transfer(disputeJuryAddress, juryAmount),
            "Jury transfer failed"
        );
        
        emit MilestoneDisputed(projectId, milestoneIndex);
        emit DisputeResolved(projectId, milestoneIndex, freelancerAmount, juryAmount);
    }
    
    /**
     * @notice Client cancels project and retrieves remaining funds
     */
    function cancelProject(uint256 projectId) external nonReentrant {
        Project storage project = projects[projectId];
        
        if (!project.isActive) revert ProjectNotActive();
        if (msg.sender != project.client) revert UnauthorizedAccess();
        
        project.isActive = false;
        
        // Return unreleased funds to client
        uint256 refundAmount = project.totalAmount - project.releasedAmount;
        
        if (refundAmount > 0) {
            require(
                stablecoin.transfer(project.client, refundAmount),
                "Refund failed"
            );
            
            emit FundsReleased(projectId, project.client, refundAmount);
        }
    }
    
    // ============ View Functions ============
    
    function getProject(uint256 projectId) external view returns (
        address client,
        address freelancer,
        uint256 totalAmount,
        uint256 releasedAmount,
        bool isActive,
        uint256 milestoneCount
    ) {
        Project storage project = projects[projectId];
        return (
            project.client,
            project.freelancer,
            project.totalAmount,
            project.releasedAmount,
            project.isActive,
            project.milestones.length
        );
    }
    
    function getMilestone(uint256 projectId, uint256 milestoneIndex) external view returns (
        uint256 amount,
        string memory description,
        MilestoneStatus status,
        uint256 completedAt
    ) {
        Milestone storage milestone = projects[projectId].milestones[milestoneIndex];
        return (
            milestone.amount,
            milestone.description,
            milestone.status,
            milestone.completedAt
        );
    }
    
    // ============ Admin Functions ============
    
    function setDisputeJuryAddress(address _disputeJury) external {
        require(disputeJuryAddress == address(0), "Already set");
        disputeJuryAddress = _disputeJury;
    }
}