// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/DisputeJury.sol";
import "./UserRegistry.t.sol";
import "forge-std/Test.sol";

contract DisputeJuryTest is Test {
    DisputeJury public jury;
    UserRegistry public userRegistry;
    MockUSDC public usdc;
    MockZKVerifier public zkVerifier;
    address public gasSponsor;
    
    address public juror1 = address(0x1);
    address public juror2 = address(0x2);
    address public juror3 = address(0x3);
    address public juror4 = address(0x4);
    address public juror5 = address(0x5);
    
    function setUp() public {
        usdc = new MockUSDC();
        zkVerifier = new MockZKVerifier();
        gasSponsor = address(0x999);
        
        userRegistry = new UserRegistry(
            address(zkVerifier),
            address(usdc),
            gasSponsor
        );
        
        jury = new DisputeJury(address(usdc), address(userRegistry));
        
        // Fund jurors and register them
        address[5] memory jurors = [juror1, juror2, juror3, juror4, juror5];
        for (uint i = 0; i < 5; i++) {
            usdc.mint(jurors[i], 1000 * 10**6);
            
            vm.prank(jurors[i]);
            userRegistry.registerBasic();
            
            bytes memory zkProof = abi.encodePacked("proof", i);
            uint256[] memory signals = new uint256[](1);
            signals[0] = i;
            
            vm.prank(jurors[i]);
            userRegistry.verifyHuman(zkProof, signals);
        }
    }
    
    function testStakeAsJuror() public {
        vm.prank(juror1);
        usdc.approve(address(jury), 100 * 10**6);
        
        vm.prank(juror1);
        jury.stakeAsJuror(100 * 10**6);
        
        (uint256 staked,,,bool isActive) = jury.getJurorInfo(juror1);
        assertEq(staked, 100 * 10**6);
        assertTrue(isActive);
    }
    
    function testCannotStakeWithoutVerification() public {
        address unverified = address(0x99);
        usdc.mint(unverified, 1000 * 10**6);
        
        vm.prank(unverified);
        usdc.approve(address(jury), 100 * 10**6);
        
        vm.prank(unverified);
        vm.expectRevert(DisputeJury.NotVerifiedHuman.selector);
        jury.stakeAsJuror(100 * 10**6);
    }
    
    function testUnstake() public {
        vm.prank(juror1);
        usdc.approve(address(jury), 100 * 10**6);
        
        vm.prank(juror1);
        jury.stakeAsJuror(100 * 10**6);
        
        uint256 balanceBefore = usdc.balanceOf(juror1);
        
        vm.prank(juror1);
        jury.unstake(50 * 10**6);
        
        uint256 balanceAfter = usdc.balanceOf(juror1);
        assertEq(balanceAfter - balanceBefore, 50 * 10**6);
    }
}