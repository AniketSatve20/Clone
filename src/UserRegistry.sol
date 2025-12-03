// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/access/Ownable.sol";
import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "./interfaces/IZKVerifier.sol";

/**
 * @title UserRegistry
 * @notice Manages user identities with tiered legitimacy model
 * @dev Implements ZK-KYC verification and ENS integration
 */
contract UserRegistry is Ownable {
    // ============ State Variables ============
    
    IZKVerifier public zkVerifier;
    IERC20 public stablecoin;
    address public gasSponsorAddress;
    
    uint256 public constant DEPOSIT_AMOUNT = 10 * 10**6; // 10 USDC (6 decimals)
    
    enum LegitimacyLevel {
        None,           // 0 - Not registered
        Basic,          // 1 - Email verified (off-chain)
        VerifiedHuman   // 2 - ZK-KYC completed
    }
    
    struct UserProfile {
        LegitimacyLevel level;
        string ensName;
        bool hasDeposited;
        uint256 registrationTime;
        bytes32 zkProofHash; // Store hash of proof for audit
    }
    
    // ============ Storage ============
    
    mapping(address => UserProfile) public users;
    mapping(bytes32 => bool) public usedProofs; // Prevent proof replay
    mapping(string => address) public ensToAddress;
    
    // ============ Events ============
    
    event UserRegistered(address indexed user, LegitimacyLevel level);
    event HumanVerified(address indexed user, bytes32 proofHash);
    event ENSLinked(address indexed user, string ensName);
    event DepositMade(address indexed user, uint256 amount);
    
    // ============ Errors ============
    
    error AlreadyRegistered();
    error InvalidProof();
    error ProofAlreadyUsed();
    error NotBasicUser();
    error ENSAlreadyLinked();
    error DepositAlreadyMade();
    error InsufficientAllowance();
    
    // ============ Constructor ============
    
    constructor(
        address _zkVerifier,
        address _stablecoin,
        address _gasSponsor
    ) Ownable(msg.sender) {
        zkVerifier = IZKVerifier(_zkVerifier);
        stablecoin = IERC20(_stablecoin);
        gasSponsorAddress = _gasSponsor;
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Register as a basic user (Level 1)
     * @dev Called after off-chain email verification
     */
    function registerBasic() external {
        if (users[msg.sender].level != LegitimacyLevel.None) {
            revert AlreadyRegistered();
        }
        
        users[msg.sender] = UserProfile({
            level: LegitimacyLevel.Basic,
            ensName: "",
            hasDeposited: false,
            registrationTime: block.timestamp,
            zkProofHash: bytes32(0)
        });
        
        emit UserRegistered(msg.sender, LegitimacyLevel.Basic);
    }
    
    /**
     * @notice Upgrade to verified human (Level 2) via ZK-KYC
     * @param zkProof Zero-knowledge proof of identity
     * @param publicSignals Public inputs to ZK circuit
     */
    function verifyHuman(
        bytes memory zkProof,
        uint256[] memory publicSignals
    ) external {
        if (users[msg.sender].level != LegitimacyLevel.Basic) {
            revert NotBasicUser();
        }
        
        // Verify the ZK proof
        if (!zkVerifier.verifyProof(zkProof, publicSignals)) {
            revert InvalidProof();
        }
        
        // Prevent proof replay attacks
        bytes32 proofHash = keccak256(zkProof);
        if (usedProofs[proofHash]) {
            revert ProofAlreadyUsed();
        }
        
        usedProofs[proofHash] = true;
        users[msg.sender].level = LegitimacyLevel.VerifiedHuman;
        users[msg.sender].zkProofHash = proofHash;
        
        emit HumanVerified(msg.sender, proofHash);
        emit UserRegistered(msg.sender, LegitimacyLevel.VerifiedHuman);
    }
    
    /**
     * @notice Link ENS name to user profile
     * @param ensName The ENS name (e.g., "alice.eth")
     */
    function linkENS(string memory ensName) external {
        if (users[msg.sender].level == LegitimacyLevel.None) {
            revert NotBasicUser();
        }
        if (bytes(users[msg.sender].ensName).length > 0) {
            revert ENSAlreadyLinked();
        }
        if (ensToAddress[ensName] != address(0)) {
            revert ENSAlreadyLinked();
        }
        
        users[msg.sender].ensName = ensName;
        ensToAddress[ensName] = msg.sender;
        
        emit ENSLinked(msg.sender, ensName);
    }
    
    /**
     * @notice Make one-time deposit to GasSponsor for gasless txns
     */
    function makeDeposit() external {
        if (users[msg.sender].hasDeposited) {
            revert DepositAlreadyMade();
        }
        
        uint256 allowance = stablecoin.allowance(msg.sender, address(this));
        if (allowance < DEPOSIT_AMOUNT) {
            revert InsufficientAllowance();
        }
        
        // Transfer stablecoin to GasSponsor
        require(
            stablecoin.transferFrom(msg.sender, gasSponsorAddress, DEPOSIT_AMOUNT),
            "Transfer failed"
        );
        
        users[msg.sender].hasDeposited = true;
        
        emit DepositMade(msg.sender, DEPOSIT_AMOUNT);
    }
    
    // ============ View Functions ============
    
    function getUserLevel(address user) external view returns (LegitimacyLevel) {
        return users[user].level;
    }
    
    function isVerifiedHuman(address user) external view returns (bool) {
        return users[user].level == LegitimacyLevel.VerifiedHuman;
    }
    
    function getUserProfile(address user) external view returns (
        LegitimacyLevel level,
        string memory ensName,
        bool hasDeposited,
        uint256 registrationTime
    ) {
        UserProfile memory profile = users[user];
        return (
            profile.level,
            profile.ensName,
            profile.hasDeposited,
            profile.registrationTime
        );
    }
    
    // ============ Admin Functions ============
    
    function updateZKVerifier(address _newVerifier) external onlyOwner {
        zkVerifier = IZKVerifier(_newVerifier);
    }
    
    function updateGasSponsor(address _newGasSponsor) external onlyOwner {
        gasSponsorAddress = _newGasSponsor;
    }
}