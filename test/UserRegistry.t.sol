// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/UserRegistry.sol";
import "../src/interfaces/IZKVerifier.sol";
import "openzeppelin-contracts/token/ERC20/ERC20.sol";

contract MockZKVerifier is IZKVerifier {
    bool public shouldPass = true;
    
    function verifyProof(bytes memory, uint256[] memory) external view override returns (bool) {
        return shouldPass;
    }
    
    function version() external pure override returns (string memory) {
        return "1.0.0";
    }
    
    function setShouldPass(bool _shouldPass) external {
        shouldPass = _shouldPass;
    }
}

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract UserRegistryTest is Test {
    UserRegistry public userRegistry;
    MockZKVerifier public zkVerifier;
    MockUSDC public usdc;
    address public gasSponsor;
    
    address public alice = address(0x1);
    address public bob = address(0x2);
    
    function setUp() public {
        // Deploy mocks
        zkVerifier = new MockZKVerifier();
        usdc = new MockUSDC();
        gasSponsor = address(0x999);
        
        // Deploy UserRegistry
        userRegistry = new UserRegistry(
            address(zkVerifier),
            address(usdc),
            gasSponsor
        );
        
        // Fund test users
        usdc.mint(alice, 100 * 10**6);
        usdc.mint(bob, 100 * 10**6);
    }
    
    function testRegisterBasic() public {
        vm.prank(alice);
        userRegistry.registerBasic();
        
        UserRegistry.LegitimacyLevel level = userRegistry.getUserLevel(alice);
        assertEq(uint(level), uint(UserRegistry.LegitimacyLevel.Basic));
    }
    
    function testCannotRegisterTwice() public {
        vm.startPrank(alice);
        userRegistry.registerBasic();
        
        vm.expectRevert(UserRegistry.AlreadyRegistered.selector);
        userRegistry.registerBasic();
        vm.stopPrank();
    }
    
    function testVerifyHuman() public {
        // Register as basic first
        vm.prank(alice);
        userRegistry.registerBasic();
        
        // Prepare ZK proof
        bytes memory zkProof = abi.encodePacked("valid_proof");
        uint256[] memory publicSignals = new uint256[](2);
        publicSignals[0] = 123;
        publicSignals[1] = 456;
        
        vm.prank(alice);
        userRegistry.verifyHuman(zkProof, publicSignals);
        
        assertTrue(userRegistry.isVerifiedHuman(alice));
    }
    
    function testCannotVerifyWithInvalidProof() public {
        vm.prank(alice);
        userRegistry.registerBasic();
        
        // Make verifier reject proofs
        zkVerifier.setShouldPass(false);
        
        bytes memory zkProof = abi.encodePacked("invalid_proof");
        uint256[] memory publicSignals = new uint256[](0);
        
        vm.prank(alice);
        vm.expectRevert(UserRegistry.InvalidProof.selector);
        userRegistry.verifyHuman(zkProof, publicSignals);
    }
    
    function testCannotReuseProof() public {
        // Alice registers and verifies
        vm.prank(alice);
        userRegistry.registerBasic();
        
        bytes memory zkProof = abi.encodePacked("valid_proof");
        uint256[] memory publicSignals = new uint256[](1);
        publicSignals[0] = 789;
        
        vm.prank(alice);
        userRegistry.verifyHuman(zkProof, publicSignals);
        
        // Bob tries to use same proof
        vm.prank(bob);
        userRegistry.registerBasic();
        
        vm.prank(bob);
        vm.expectRevert(UserRegistry.ProofAlreadyUsed.selector);
        userRegistry.verifyHuman(zkProof, publicSignals);
    }
    
    function testLinkENS() public {
        vm.prank(alice);
        userRegistry.registerBasic();
        
        vm.prank(alice);
        userRegistry.linkENS("alice.eth");
        
        (,string memory ensName,,) = userRegistry.getUserProfile(alice);
        assertEq(ensName, "alice.eth");
    }
    
    function testCannotLinkENSTwice() public {
        vm.startPrank(alice);
        userRegistry.registerBasic();
        userRegistry.linkENS("alice.eth");
        
        vm.expectRevert(UserRegistry.ENSAlreadyLinked.selector);
        userRegistry.linkENS("alice2.eth");
        vm.stopPrank();
    }
    
    function testMakeDeposit() public {
        vm.prank(alice);
        userRegistry.registerBasic();
        
        // Approve UserRegistry to spend USDC
        vm.prank(alice);
        usdc.approve(address(userRegistry), 10 * 10**6);
        
        // Make deposit
        vm.prank(alice);
        userRegistry.makeDeposit();
        
        (,,bool hasDeposited,) = userRegistry.getUserProfile(alice);
        assertTrue(hasDeposited);
    }
    
    function testCannotDepositTwice() public {
        vm.prank(alice);
        userRegistry.registerBasic();
        
        vm.prank(alice);
        usdc.approve(address(userRegistry), 20 * 10**6);
        
        vm.prank(alice);
        userRegistry.makeDeposit();
        
        vm.prank(alice);
        vm.expectRevert(UserRegistry.DepositAlreadyMade.selector);
        userRegistry.makeDeposit();
    }
}