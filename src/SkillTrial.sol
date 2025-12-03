// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/access/Ownable.sol";
import "openzeppelin-contracts/utils/ReentrancyGuard.sol";

/**
 * @title SkillTrial
 * @notice Manages paid skill trials with AI scoring and NFT badges
 * @dev Integrates with oracle for AI quality assessment
 */
contract SkillTrial is ERC721, Ownable, ReentrancyGuard {
    // ============ State Variables ============
    
    IERC20 public immutable stablecoin;
    address public oracleAddress;
    
    uint256 public trialCounter;
    uint256 public badgeCounter;
    
    enum TrialStatus {
        Active,
        Submitted,
        Scored,
        Paid,
        Failed
    }
    
    struct Trial {
        address client;
        address freelancer;
        string skillCategory;
        string taskDescription;
        uint256 reward;
        TrialStatus status;
        uint256 aiScore; // 0-100
        uint256 createdAt;
        uint256 submittedAt;
    }
    
    struct SkillBadge {
        string skillCategory;
        uint256 score;
        uint256 earnedAt;
    }
    
    // ============ Storage ============
    
    mapping(uint256 => Trial) public trials;
    mapping(uint256 => SkillBadge) public badges;
    mapping(address => uint256[]) public freelancerBadges;
    
    // ============ Events ============
    
    event TrialCreated(
        uint256 indexed trialId,
        address indexed client,
        address indexed freelancer,
        string skillCategory,
        uint256 reward
    );
    event TrialSubmitted(uint256 indexed trialId, uint256 submittedAt);
    event TrialScored(uint256 indexed trialId, uint256 score);
    event TrialPaid(uint256 indexed trialId, uint256 amount);
    event BadgeMinted(uint256 indexed badgeId, address indexed freelancer, string skillCategory, uint256 score);
    
    // ============ Errors ============
    
    error InvalidReward();
    error UnauthorizedAccess();
    error InvalidStatus();
    error OnlyOracle();
    error ScoreTooLow();
    
    // ============ Constructor ============
    
    constructor(
        address _stablecoin,
        address _oracle
    ) ERC721("HumanWork Skill Badge", "HWSKILL") Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
        oracleAddress = _oracle;
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Create a new skill trial
     */
    function createTrial(
        address freelancer,
        string calldata skillCategory,
        string calldata taskDescription,
        uint256 reward
    ) external nonReentrant returns (uint256) {
        if (reward == 0) revert InvalidReward();
        
        // Transfer reward to escrow
        require(
            stablecoin.transferFrom(msg.sender, address(this), reward),
            "Transfer failed"
        );
        
        uint256 trialId = trialCounter++;
        
        trials[trialId] = Trial({
            client: msg.sender,
            freelancer: freelancer,
            skillCategory: skillCategory,
            taskDescription: taskDescription,
            reward: reward,
            status: TrialStatus.Active,
            aiScore: 0,
            createdAt: block.timestamp,
            submittedAt: 0
        });
        
        emit TrialCreated(trialId, msg.sender, freelancer, skillCategory, reward);
        
        return trialId;
    }
    
    /**
     * @notice Freelancer submits completed trial work
     */
    function submitTrial(uint256 trialId) external {
        Trial storage trial = trials[trialId];
        
        if (msg.sender != trial.freelancer) revert UnauthorizedAccess();
        if (trial.status != TrialStatus.Active) revert InvalidStatus();
        
        trial.status = TrialStatus.Submitted;
        trial.submittedAt = block.timestamp;
        
        emit TrialSubmitted(trialId, block.timestamp);
    }
    
    /**
     * @notice Oracle calls this to provide AI scoring and trigger payment
     * @param trialId The trial ID
     * @param score AI-generated quality score (0-100)
     */
    function fulfillAIScoring(uint256 trialId, uint256 score) external nonReentrant {
        if (msg.sender != oracleAddress) revert OnlyOracle();
        
        Trial storage trial = trials[trialId];
        
        if (trial.status != TrialStatus.Submitted) revert InvalidStatus();
        
        trial.aiScore = score;
        trial.status = TrialStatus.Scored;
        
        emit TrialScored(trialId, score);
        
        // If score >= 70, pay freelancer and mint badge
        if (score >= 70) {
            trial.status = TrialStatus.Paid;
            
            // Pay freelancer
            require(
                stablecoin.transfer(trial.freelancer, trial.reward),
                "Payment failed"
            );
            
            emit TrialPaid(trialId, trial.reward);
            
            // Mint Skill Badge NFT
            uint256 badgeId = badgeCounter++;
            _safeMint(trial.freelancer, badgeId);
            
            badges[badgeId] = SkillBadge({
                skillCategory: trial.skillCategory,
                score: score,
                earnedAt: block.timestamp
            });
            
            freelancerBadges[trial.freelancer].push(badgeId);
            
            emit BadgeMinted(badgeId, trial.freelancer, trial.skillCategory, score);
        } else {
            trial.status = TrialStatus.Failed;
            
            // Refund client
            require(
                stablecoin.transfer(trial.client, trial.reward),
                "Refund failed"
            );
        }
    }
    
    // ============ View Functions ============
    
    function getTrial(uint256 trialId) external view returns (
        address client,
        address freelancer,
        string memory skillCategory,
        uint256 reward,
        TrialStatus status,
        uint256 aiScore
    ) {
        Trial storage trial = trials[trialId];
        return (
            trial.client,
            trial.freelancer,
            trial.skillCategory,
            trial.reward,
            trial.status,
            trial.aiScore
        );
    }
    
    function getFreelancerBadges(address freelancer) external view returns (uint256[] memory) {
        return freelancerBadges[freelancer];
    }
    
    function getBadge(uint256 badgeId) external view returns (
        string memory skillCategory,
        uint256 score,
        uint256 earnedAt
    ) {
        SkillBadge storage badge = badges[badgeId];
        return (badge.skillCategory, badge.score, badge.earnedAt);
    }
    
    // ============ Admin Functions ============
    
    function updateOracle(address _newOracle) external onlyOwner {
        oracleAddress = _newOracle;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        
        SkillBadge storage badge = badges[tokenId];
        
        // In production, return proper metadata URI
        return string(abi.encodePacked(
            "https://api.humanwork.io/badge/",
            Strings.toString(tokenId)
        ));
    }
}