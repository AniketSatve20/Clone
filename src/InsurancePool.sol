// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/access/Ownable.sol";
import "openzeppelin-contracts/utils/ReentrancyGuard.sol";

/**
 * @title InsurancePool
 * @notice Core revenue contract for optional insurance premiums
 * @dev Monetization strategy: 0% platform fees + optional insurance
 */
contract InsurancePool is Ownable, ReentrancyGuard {
    // ============ State Variables ============
    
    IERC20 public immutable stablecoin;
    
    uint256 public constant PREMIUM_PERCENTAGE = 5; // 5% of project value
    uint256 public constant COVERAGE_PERCENTAGE = 100; // 100% coverage
    uint256 public constant POLICY_DURATION = 90 days;
    
    uint256 public policyCounter;
    uint256 public totalPremiumsCollected;
    uint256 public totalClaimsPaid;
    
    enum PolicyStatus {
        Active,
        Expired,
        Claimed
    }
    
    struct InsurancePolicy {
        address policyholder;
        uint256 projectId;
        uint256 coverageAmount;
        uint256 premiumPaid;
        uint256 startTime;
        uint256 expiryTime;
        PolicyStatus status;
    }
    
    // ============ Storage ============
    
    mapping(uint256 => InsurancePolicy) public policies;
    mapping(uint256 => uint256) public projectToPolicy; // projectId => policyId
    mapping(address => uint256[]) public userPolicies;
    
    // ============ Events ============
    
    event InsurancePurchased(
        uint256 indexed policyId,
        address indexed policyholder,
        uint256 indexed projectId,
        uint256 coverageAmount,
        uint256 premium
    );
    event ClaimFiled(uint256 indexed policyId, uint256 claimAmount);
    event ClaimPaid(uint256 indexed policyId, address indexed recipient, uint256 amount);
    event PremiumWithdrawn(address indexed owner, uint256 amount);
    
    // ============ Errors ============
    
    error InvalidProjectId();
    error PolicyAlreadyExists();
    error InvalidCoverageAmount();
    error InsufficientPoolBalance();
    error PolicyNotActive();
    error ClaimExceedsCoverage();
    
    // ============ Constructor ============
    
    constructor(address _stablecoin) Ownable(msg.sender) {
        stablecoin = IERC20(_stablecoin);
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Buy insurance for a project
     * @param projectId The ID of the project to insure
     * @param coverageAmount The amount to be covered
     */
    function buyInsurance(
        uint256 projectId,
        uint256 coverageAmount
    ) external nonReentrant returns (uint256) {
        if (coverageAmount == 0) revert InvalidCoverageAmount();
        if (projectToPolicy[projectId] != 0) revert PolicyAlreadyExists();
        
        // Calculate premium (5% of coverage amount)
        uint256 premium = (coverageAmount * PREMIUM_PERCENTAGE) / 100;
        
        // Transfer premium to pool
        require(
            stablecoin.transferFrom(msg.sender, address(this), premium),
            "Premium transfer failed"
        );
        
        uint256 policyId = policyCounter++;
        
        policies[policyId] = InsurancePolicy({
            policyholder: msg.sender,
            projectId: projectId,
            coverageAmount: coverageAmount,
            premiumPaid: premium,
            startTime: block.timestamp,
            expiryTime: block.timestamp + POLICY_DURATION,
            status: PolicyStatus.Active
        });
        
        projectToPolicy[projectId] = policyId;
        userPolicies[msg.sender].push(policyId);
        
        totalPremiumsCollected += premium;
        
        emit InsurancePurchased(policyId, msg.sender, projectId, coverageAmount, premium);
        
        return policyId;
    }
    
    /**
     * @notice File an insurance claim
     * @param policyId The policy ID
     * @param claimAmount The amount to claim
     */
    function fileClaim(uint256 policyId, uint256 claimAmount) external nonReentrant {
        InsurancePolicy storage policy = policies[policyId];
        
        if (msg.sender != policy.policyholder) revert PolicyNotActive();
        if (policy.status != PolicyStatus.Active) revert PolicyNotActive();
        if (block.timestamp > policy.expiryTime) revert PolicyNotActive();
        if (claimAmount > policy.coverageAmount) revert ClaimExceedsCoverage();
        
        uint256 poolBalance = stablecoin.balanceOf(address(this));
        if (poolBalance < claimAmount) revert InsufficientPoolBalance();
        
        policy.status = PolicyStatus.Claimed;
        totalClaimsPaid += claimAmount;
        
        emit ClaimFiled(policyId, claimAmount);
        
        // Pay claim
        require(
            stablecoin.transfer(policy.policyholder, claimAmount),
            "Claim payment failed"
        );
        
        emit ClaimPaid(policyId, policy.policyholder, claimAmount);
    }
    
    /**
     * @notice Expire old policies (callable by anyone for gas efficiency)
     */
    function expirePolicy(uint256 policyId) external {
        InsurancePolicy storage policy = policies[policyId];
        
        if (policy.status == PolicyStatus.Active && block.timestamp > policy.expiryTime) {
            policy.status = PolicyStatus.Expired;
        }
    }
    
    // ============ View Functions ============
    
    function getPolicy(uint256 policyId) external view returns (
        address policyholder,
        uint256 projectId,
        uint256 coverageAmount,
        uint256 premiumPaid,
        PolicyStatus status,
        uint256 expiryTime
    ) {
        InsurancePolicy storage policy = policies[policyId];
        return (
            policy.policyholder,
            policy.projectId,
            policy.coverageAmount,
            policy.premiumPaid,
            policy.status,
            policy.expiryTime
        );
    }
    
    function getUserPolicies(address user) external view returns (uint256[] memory) {
        return userPolicies[user];
    }
    
    function getPoolBalance() external view returns (uint256) {
        return stablecoin.balanceOf(address(this));
    }
    
    function getPoolMetrics() external view returns (
        uint256 premiumsCollected,
        uint256 claimsPaid,
        uint256 currentBalance,
        uint256 profit
    ) {
        uint256 balance = stablecoin.balanceOf(address(this));
        return (
            totalPremiumsCollected,
            totalClaimsPaid,
            balance,
            totalPremiumsCollected > totalClaimsPaid 
                ? totalPremiumsCollected - totalClaimsPaid 
                : 0
        );
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Withdraw excess premiums (profits) to owner
     */
    function withdrawPremiums(uint256 amount) external onlyOwner nonReentrant {
        uint256 availableBalance = stablecoin.balanceOf(address(this));
        
        require(amount <= availableBalance, "Insufficient balance");
        
        require(
            stablecoin.transfer(owner(), amount),
            "Withdrawal failed"
        );
        
        emit PremiumWithdrawn(owner(), amount);
    }
}