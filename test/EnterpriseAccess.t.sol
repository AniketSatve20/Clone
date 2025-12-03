// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/EnterpriseAccess.sol";
import "forge-std/Test.sol";
import "./UserRegistry.t.sol";

contract EnterpriseAccessTest is Test {
    EnterpriseAccess public enterprise;
    MockUSDC public usdc;
    
    address public subAdmin = address(0x1); // This user will subscribe and become an "Admin"
    address public manager1 = address(0x2);
    address public manager2 = address(0x3);
    
    function setUp() public {
        usdc = new MockUSDC();
        
        // 1. Deploy the contract. The test contract (address(this)) is the Owner.
        enterprise = new EnterpriseAccess(address(usdc));
        
        // 2. Mint USDC to the user who will subscribe
        usdc.mint(subAdmin, 10000 * 10**6);
    }
    
    // Helper function to subscribe
    function _subscribe() internal {
        // Use startPrank/stopPrank to make 'subAdmin' the caller
        // for both 'approve' and 'subscribe'.
        vm.startPrank(subAdmin);
        usdc.approve(address(enterprise), 5000 * 10**6);
        enterprise.subscribe(EnterpriseAccess.SubscriptionTier.Annual);
        vm.stopPrank();
    }

    // This test was already passing, but let's use the new var names for clarity
    function testSubscribe() public {
        vm.prank(subAdmin);
        usdc.approve(address(enterprise), 5000 * 10**6);
        
        vm.prank(subAdmin);
        uint256 subId = enterprise.subscribe(EnterpriseAccess.SubscriptionTier.Annual);
        
        (address admin,,,,,, ) = enterprise.getSubscription(subId);
        assertEq(admin, subAdmin);
        assertEq(enterprise.ownerOf(subId), subAdmin);
    }
    
    // ==================================================================
    // START OF CORRECTED TESTS
    // ==================================================================

    function testAddManager() public {
        // 1. The 'subAdmin' (0x1) subscribes
        _subscribe();
        
        // 2. The 'subAdmin' (now a subscription admin) adds manager1.
        vm.prank(subAdmin);
        enterprise.addManager(manager1);
        
        // 3. Check
        assertTrue(enterprise.isEnterpriseUser(manager1));
    }
    
    function testRemoveManager() public {
        // 1. 'subAdmin' subscribes
        _subscribe();
        
        // 2. 'subAdmin' adds manager1
        vm.prank(subAdmin);
        enterprise.addManager(manager1);
        
        // 3. Check that it worked
        assertTrue(enterprise.isEnterpriseUser(manager1));
        
        // 4. 'subAdmin' removes manager1
        vm.prank(subAdmin);
        enterprise.removeManager(manager1);

        // 5. Check
        assertFalse(enterprise.isEnterpriseUser(manager1));
    }

    function testIsEnterpriseUser() public {
        // 1. 'subAdmin' subscribes
        _subscribe();

        // 2. Check: The 'subAdmin' *is* an enterprise user because they are an active admin
        assertTrue(enterprise.isEnterpriseUser(subAdmin));
        
        // 3. Check: manager1 is not an enterprise user yet
        assertFalse(enterprise.isEnterpriseUser(manager1));
        
        // 4. 'subAdmin' adds manager1
        vm.prank(subAdmin);
        enterprise.addManager(manager1);

        // 5. Check
        assertTrue(enterprise.isEnterpriseUser(manager1));
        assertFalse(enterprise.isEnterpriseUser(manager2));
    }
}