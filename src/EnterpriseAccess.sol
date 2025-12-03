// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/access/Ownable.sol";
import "openzeppelin-contracts/utils/ReentrancyGuard.sol";

/**
 * @title EnterpriseAccess
 * @notice B2B SaaS subscription management via NFTs
 * @dev Enterprises pay in stablecoin, receive subscription NFT, manage team access
 */
contract EnterpriseAccess is ERC721, Ownable, ReentrancyGuard {
    // ============ State Variables ============
    
    IERC20 public immutable stablecoin;
    
    uint256 public constant MONTHLY_FEE = 500 * 10**6; // 500 USDC
    uint256 public constant ANNUAL_FEE = 5000 * 10**6; // 5000 USDC (2 months free)
    
    uint256 public subscriptionCounter;
    
    enum SubscriptionTier {
        None,
        Monthly,
        Annual
    }
    
    struct Subscription {
        address admin;
        SubscriptionTier tier;
        uint256 startTime;
        uint256 expiryTime;
        bool isActive;
        address[] managers;
        mapping(address => bool) isManager;
        uint256 totalSpent;
        uint256 projectsCreated;
    }
    
    // ============ Storage ============
    
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256) public adminToSubscription;
    mapping(address => uint256[]) public userSubscriptions; // Track all subscriptions user is part of
    
    uint256 public totalRevenue;
    
    // ============ Events ============
    
    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        address indexed admin,
        SubscriptionTier tier,
        uint256 expiryTime
    );
    event SubscriptionRenewed(uint256 indexed subscriptionId, uint256 newExpiryTime);
    event ManagerAdded(uint256 indexed subscriptionId, address indexed manager);
    event ManagerRemoved(uint256 indexed subscriptionId, address indexed manager);
    event SubscriptionCancelled(uint256 indexed subscriptionId);
    
    // ============ Errors ============
    
    error AlreadyHasSubscription();
    error InvalidTier();
    error NotAdmin();
    error SubscriptionExpired();
    error ManagerAlreadyExists();
    error ManagerNotFound();
    error NotEnterpriseUser();
    
    // ============ Constructor ============
    
    constructor(address _stablecoin) 
        ERC721("HumanWork Enterprise Subscription", "HWENT") 
        Ownable(msg.sender) 
    {
        stablecoin = IERC20(_stablecoin);
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Purchase enterprise subscription
     * @param tier The subscription tier (1 = Monthly, 2 = Annual)
     */
    function subscribe(SubscriptionTier tier) external nonReentrant returns (uint256) {
        if (adminToSubscription[msg.sender] != 0) revert AlreadyHasSubscription();
        if (tier == SubscriptionTier.None) revert InvalidTier();
        
        uint256 fee = tier == SubscriptionTier.Monthly ? MONTHLY_FEE : ANNUAL_FEE;
        uint256 duration = tier == SubscriptionTier.Monthly ? 30 days : 365 days;
        
        // Transfer subscription fee
        require(
            stablecoin.transferFrom(msg.sender, address(this), fee),
            "Payment failed"
        );
        
        // --- THIS IS THE FIX ---
        // Change from subscriptionCounter++ (post-increment)
        // to ++subscriptionCounter (pre-increment)
        // This makes the first subscriptionId = 1, not 0.
        uint256 subscriptionId = ++subscriptionCounter;
        // --- END FIX ---
        
        // Mint subscription NFT to admin
        _safeMint(msg.sender, subscriptionId);
        
        Subscription storage sub = subscriptions[subscriptionId];
        sub.admin = msg.sender;
        sub.tier = tier;
        sub.startTime = block.timestamp;
        sub.expiryTime = block.timestamp + duration;
        sub.isActive = true;
        sub.totalSpent = fee;
        
        adminToSubscription[msg.sender] = subscriptionId;
        userSubscriptions[msg.sender].push(subscriptionId);
        
        totalRevenue += fee;
        
        emit SubscriptionCreated(subscriptionId, msg.sender, tier, sub.expiryTime);
        
        return subscriptionId;
    }
    
    /**
     * @notice Renew existing subscription
     */
    function renewSubscription(uint256 subscriptionId) external nonReentrant {
        Subscription storage sub = subscriptions[subscriptionId];
        
        if (msg.sender != sub.admin) revert NotAdmin();
        
        uint256 fee = sub.tier == SubscriptionTier.Monthly ? MONTHLY_FEE : ANNUAL_FEE;
        uint256 duration = sub.tier == SubscriptionTier.Monthly ? 30 days : 365 days;
        
        require(
            stablecoin.transferFrom(msg.sender, address(this), fee),
            "Payment failed"
        );
        
        // Extend from current expiry or from now, whichever is later
        uint256 baseTime = block.timestamp > sub.expiryTime ? block.timestamp : sub.expiryTime;
        sub.expiryTime = baseTime + duration;
        sub.isActive = true;
        sub.totalSpent += fee;
        totalRevenue += fee;
        
        emit SubscriptionRenewed(subscriptionId, sub.expiryTime);
    }
    
    /**
     * @notice Admin adds a manager to their team
     */
    function addManager(address manager) external {
        uint256 subscriptionId = adminToSubscription[msg.sender];
        if (subscriptionId == 0) revert NotAdmin();
        
        Subscription storage sub = subscriptions[subscriptionId];
        
        if (block.timestamp > sub.expiryTime) revert SubscriptionExpired();
        if (sub.isManager[manager]) revert ManagerAlreadyExists();
        
        sub.managers.push(manager);
        sub.isManager[manager] = true;
        userSubscriptions[manager].push(subscriptionId);
        
        emit ManagerAdded(subscriptionId, manager);
    }
    
    /**
     * @notice Admin removes a manager from their team
     */
    function removeManager(address manager) external {
        uint256 subscriptionId = adminToSubscription[msg.sender];
        if (subscriptionId == 0) revert NotAdmin();
        
        Subscription storage sub = subscriptions[subscriptionId];
        
        if (!sub.isManager[manager]) revert ManagerNotFound();
        
        sub.isManager[manager] = false;
        
        // Remove from managers array
        for (uint256 i = 0; i < sub.managers.length; i++) {
            if (sub.managers[i] == manager) {
                sub.managers[i] = sub.managers[sub.managers.length - 1];
                sub.managers.pop();
                break;
            }
        }
        
        emit ManagerRemoved(subscriptionId, manager);
    }
    
    /**
     * @notice Cancel subscription (does not refund)
     */
    function cancelSubscription(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        
        if (msg.sender != sub.admin) revert NotAdmin();
        
        sub.isActive = false;
        
        emit SubscriptionCancelled(subscriptionId);
    }
    
    /**
     * @notice Increment project counter for analytics
     */
    function recordProjectCreated(address user) external {
        uint256 subscriptionId = _getUserSubscriptionId(user);
        if (subscriptionId != 0) {
            subscriptions[subscriptionId].projectsCreated++;
        }
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Check if address has enterprise access
     * @dev Returns true if user is admin or manager of active subscription
     */
    function isEnterpriseUser(address user) external view returns (bool) {
        // Check if user is admin
        uint256 adminSub = adminToSubscription[user];
        if (adminSub != 0) {
            Subscription storage sub = subscriptions[adminSub];
            if (sub.isActive && block.timestamp <= sub.expiryTime) {
                return true;
            }
        }
        
        // Check if user is manager in any subscription
        uint256[] memory subs = userSubscriptions[user];
        for (uint256 i = 0; i < subs.length; i++) {
            Subscription storage sub = subscriptions[subs[i]];
            if (sub.isManager[user] && sub.isActive && block.timestamp <= sub.expiryTime) {
                return true;
            }
        }
        
        return false;
    }
    
    function getSubscription(uint256 subscriptionId) external view returns (
        address admin,
        SubscriptionTier tier,
        uint256 expiryTime,
        bool isActive,
        uint256 managerCount,
        uint256 totalSpent,
        uint256 projectsCreated
    ) {
        Subscription storage sub = subscriptions[subscriptionId];
        return (
            sub.admin,
            sub.tier,
            sub.expiryTime,
            sub.isActive,
            sub.managers.length,
            sub.totalSpent,
            sub.projectsCreated
        );
    }
    
    function getManagers(uint256 subscriptionId) external view returns (address[] memory) {
        return subscriptions[subscriptionId].managers;
    }
    
    function isManager(uint256 subscriptionId, address user) external view returns (bool) {
        return subscriptions[subscriptionId].isManager[user];
    }
    
    function getUserSubscriptionId(address user) external view returns (uint256) {
        return _getUserSubscriptionId(user);
    }
    
    // ============ Internal Functions ============
    
    function _getUserSubscriptionId(address user) internal view returns (uint256) {
        // Check if admin
        uint256 adminSub = adminToSubscription[user];
        if (adminSub != 0) {
            return adminSub;
        }
        
        // Check if manager
        uint256[] memory subs = userSubscriptions[user];
        for (uint256 i = 0; i < subs.length; i++) {
            if (subscriptions[subs[i]].isManager[user]) {
                return subs[i];
            }
        }
        
        return 0;
    }
    
    // ============ Admin Functions ============
        
    /**
     * @notice Withdraw revenue to protocol treasury
     */
    function withdrawRevenue(uint256 amount) external onlyOwner nonReentrant {
        require(
            stablecoin.transfer(owner(), amount),
            "Withdrawal failed"
        );
    }
    
    function getTotalRevenue() external view returns (uint256) {
        return totalRevenue;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        
        return string(abi.encodePacked(
            "https://api.humanwork.io/enterprise/subscription/",
            Strings.toString(tokenId)
        ));
    }
}