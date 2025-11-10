# Schedule Registration - Comprehensive Test Scenarios (300+ Tests)

## Test Coverage Areas
1. Authentication States (50+ tests)
2. Verification States (30+ tests)
3. Token Management (40+ tests)
4. Registration Status Flow (60+ tests)
5. Session-Specific Scenarios (50+ tests)
6. Payment Flow (40+ tests)
7. Edge Cases & Error Handling (30+ tests)

---

## 1. AUTHENTICATION STATE TESTS (50 Tests)

### 1.1 Not Logged In (10 tests)
- [ ] T001: User not logged in tries to register - should redirect to /auth/login
- [ ] T002: User not logged in tries to view "Request Spot" (full class) - should redirect to /auth/login
- [ ] T003: User not logged in sees "Log in to Register" button
- [ ] T004: User not logged in sees "Log in to Request Spot" for full sessions
- [ ] T005: User not logged in can view schedule list
- [ ] T006: User not logged in can view schedule details
- [ ] T007: User not logged in can view session dates
- [ ] T008: User not logged in sees price information
- [ ] T009: User not logged in cannot see registration status badges
- [ ] T010: User not logged in does not trigger fetchUserRegistrations call

### 1.2 Logged In But Not Verified (10 tests)
- [ ] T011: Logged in but unverified user tries to register - should redirect to /auth/verify
- [ ] T012: Logged in but unverified user tries to request spot - should redirect to /auth/verify
- [ ] T013: Logged in but unverified user sees "Verify Account to Register" button
- [ ] T014: Logged in but unverified user sees "Verify Account to Request" for full sessions
- [ ] T015: Logged in but unverified user can view all schedules
- [ ] T016: Logged in but unverified user does not trigger fetchUserRegistrations
- [ ] T017: Logged in but unverified user sees correct message when clicking register
- [ ] T018: Logged in but unverified user state persists across page refresh
- [ ] T019: Logged in but unverified user can logout
- [ ] T020: Logged in but unverified user redirects work correctly (no infinite loops)

### 1.3 Logged In And Verified (10 tests)
- [ ] T021: Verified user can register for available session
- [ ] T022: Verified user can request spot for full session
- [ ] T023: Verified user sees their registration status badges
- [ ] T024: Verified user sees "Register for [date] session" button
- [ ] T025: Verified user can select different sessions
- [ ] T026: Verified user sees calendar modal to choose session
- [ ] T027: Verified user registration triggers fetchUserRegistrations
- [ ] T028: Verified user sees updated status after registration
- [ ] T029: Verified user can register for multiple sessions in same schedule
- [ ] T030: Verified user state persists across page refresh

### 1.4 Token Expiration Scenarios (20 tests)
- [ ] T031: Token expired during registration - should get 401 error
- [ ] T032: Token expired during registration - should show "Session expired" message
- [ ] T033: Token expired during registration - should redirect to login
- [ ] T034: Token expired when fetching registrations - should handle gracefully
- [ ] T035: Token expired - should clear local storage
- [ ] T036: Token expired - should clear user state
- [ ] T037: Token expired - should show clear error message
- [ ] T038: Invalid token format - should be handled
- [ ] T039: Token missing from localStorage - should not crash
- [ ] T040: Token corrupted - should handle error
- [ ] T041: Token expired mid-session - should detect on next API call
- [ ] T042: Token refresh not available - should logout user
- [ ] T043: Token expiry before page load - should redirect to login
- [ ] T044: Multiple API calls with expired token - should handle all
- [ ] T045: Token expires while calendar modal open - should handle
- [ ] T046: Token expires after selecting session but before submit
- [ ] T047: Token expires during request-full-class call
- [ ] T048: Token expires during fetchUserRegistrations
- [ ] T049: 401 Unauthorized response - should trigger logout
- [ ] T050: 403 Forbidden response - should show permission error

---

## 2. VERIFICATION STATE TESTS (30 Tests)

### 2.1 Email Verification (15 tests)
- [ ] T051: Unverified email blocks registration
- [ ] T052: Unverified email shows correct button text
- [ ] T053: Unverified email redirect works
- [ ] T054: User verifies email - can now register
- [ ] T055: User verifies email - state updates correctly
- [ ] T056: Verification status checked on mount
- [ ] T057: Verification status checked after login
- [ ] T058: Verification link from email works
- [ ] T059: Verification code submission works
- [ ] T060: Verification status updates in real-time
- [ ] T061: User can request new verification code
- [ ] T062: Verification page accessible when unverified
- [ ] T063: Verification page redirects when already verified
- [ ] T064: Verification status persists across sessions
- [ ] T065: Multiple verification attempts handled correctly

### 2.2 Account Status (15 tests)
- [ ] T066: Suspended account cannot register
- [ ] T067: Deleted account redirects to login
- [ ] T068: Inactive account shows appropriate message
- [ ] T069: Banned account cannot access registration
- [ ] T070: Account reactivation allows registration
- [ ] T071: Account status changes mid-session handled
- [ ] T072: Admin deactivates account - user sees error
- [ ] T073: Account locked after failed attempts
- [ ] T074: Account unlock allows registration again
- [ ] T075: Account status checked on each registration
- [ ] T076: Account email changed - verification reset
- [ ] T077: Account upgraded - permissions updated
- [ ] T078: Account downgraded - still can register
- [ ] T079: Multiple account status changes handled
- [ ] T080: Account status persists correctly

---

## 3. TOKEN MANAGEMENT TESTS (40 Tests)

### 3.1 Token Storage (10 tests)
- [ ] T081: Token stored in localStorage on login
- [ ] T082: Token retrieved correctly on mount
- [ ] T083: Token cleared on logout
- [ ] T084: Token persists across page refresh
- [ ] T085: Token not exposed in console logs
- [ ] T086: Token sent in Authorization header
- [ ] T087: Token format validated (Bearer prefix)
- [ ] T088: Multiple tabs share same token
- [ ] T089: Token updates across tabs on login
- [ ] T090: Token clears across tabs on logout

### 3.2 Token Validation (15 tests)
- [ ] T091: Malformed token rejected by backend
- [ ] T092: Empty token shows not logged in
- [ ] T093: Null token handled gracefully
- [ ] T094: Undefined token handled gracefully
- [ ] T095: Token with special characters handled
- [ ] T096: Token too long rejected
- [ ] T097: Token too short rejected
- [ ] T098: Token signature invalid - 401 error
- [ ] T099: Token payload tampered - 401 error
- [ ] T100: Token algorithm mismatch detected
- [ ] T101: Token issuer validation works
- [ ] T102: Token audience validation works
- [ ] T103: Token not yet valid (nbf claim)
- [ ] T104: Token claims validated on backend
- [ ] T105: Token user ID matches database

### 3.3 Token Expiration (15 tests)
- [ ] T106: Token expires after set duration
- [ ] T107: Expired token detected on registration
- [ ] T108: Expired token triggers logout
- [ ] T109: Expired token clears from storage
- [ ] T110: Token expiry time calculated correctly
- [ ] T111: Token near expiry still works
- [ ] T112: Token expired by 1 second fails
- [ ] T113: Token expiry checked before API call
- [ ] T114: Token expiry message shows to user
- [ ] T115: Multiple expired token scenarios handled
- [ ] T116: Token refresh not implemented - shows login
- [ ] T117: Token lifetime displayed to user (optional)
- [ ] T118: Token expiry countdown (optional)
- [ ] T119: Remember me extends token life (if implemented)
- [ ] T120: Token expiry logs user activity

---

## 4. REGISTRATION STATUS FLOW TESTS (60 Tests)

### 4.1 Pending Status (12 tests)
- [ ] T121: New registration creates "pending" status
- [ ] T122: Pending status badge displays correctly
- [ ] T123: Pending registration cannot be duplicated
- [ ] T124: Pending status persists across refresh
- [ ] T125: Pending registration can be viewed by user
- [ ] T126: Pending status shown in my-registrations
- [ ] T127: Pending registration awaits admin approval
- [ ] T128: Pending user cannot access session materials
- [ ] T129: Pending status email sent to user
- [ ] T130: Pending status notification to admin
- [ ] T131: Multiple pending registrations tracked separately
- [ ] T132: Pending to approved transition works

### 4.2 Approved Status (12 tests)
- [ ] T133: Admin approves - status changes to "approved"
- [ ] T134: Approved status badge displays correctly
- [ ] T135: Approved user gets email notification
- [ ] T136: Approved status persists across refresh
- [ ] T137: Approved user can proceed to payment
- [ ] T138: Approved registration cannot be re-submitted
- [ ] T139: Approved but unpaid shows payment prompt
- [ ] T140: Approved registration visible in user dashboard
- [ ] T141: Approved status shown with payment pending
- [ ] T142: Approved user waits for payment confirmation
- [ ] T143: Approved to paid transition works
- [ ] T144: Approved to rejected reversal possible

### 4.3 Rejected Status (12 tests)
- [ ] T145: Admin rejects - status changes to "rejected"
- [ ] T146: Rejected status badge displays correctly
- [ ] T147: Rejected user gets email with reason
- [ ] T148: Rejection reason displayed to user
- [ ] T149: Rejected registration allows re-registration
- [ ] T150: Rejected status persists across refresh
- [ ] T151: Rejected user can register for different session
- [ ] T152: Rejected registration removed from my-registrations (or marked)
- [ ] T153: Rejection reason field required by admin
- [ ] T154: Rejection reason max length enforced
- [ ] T155: Rejected user cannot access session
- [ ] T156: Rejected status cannot bypass to paid

### 4.4 Payment Status - Unpaid (8 tests)
- [ ] T157: New approved registration is "unpaid"
- [ ] T158: Unpaid status badge shows correctly
- [ ] T159: Unpaid user prompted for payment
- [ ] T160: Unpaid registration does not count toward capacity
- [ ] T161: Unpaid status persists across refresh
- [ ] T162: Unpaid user receives payment reminder
- [ ] T163: Unpaid can transition to paid
- [ ] T164: Unpaid can transition to free

### 4.5 Payment Status - Pending (8 tests)
- [ ] T165: Manual payment submitted - status "pending"
- [ ] T166: Pending payment badge shows correctly
- [ ] T167: Pending payment awaits admin confirmation
- [ ] T168: Pending payment notification to admin
- [ ] T169: Pending payment persists across refresh
- [ ] T170: Pending payment can be approved to paid
- [ ] T171: Pending payment can be rejected back to unpaid
- [ ] T172: Pending payment user cannot access session yet

### 4.6 Payment Status - Paid (8 tests)
- [ ] T173: Payment confirmed - status changes to "paid"
- [ ] T174: Paid status badge shows correctly (green/success)
- [ ] T175: Paid user gets access to session materials
- [ ] T176: Paid registration counts toward capacity
- [ ] T177: Paid status persists across refresh
- [ ] T178: Paid user cannot register for same session again
- [ ] T179: Paid user receives confirmation email
- [ ] T180: Paid status shows in my-registrations

---

## 5. SESSION-SPECIFIC SCENARIOS (50 Tests)

### 5.1 Session Selection (10 tests)
- [ ] T181: User can view all available sessions
- [ ] T182: User can select a session from calendar
- [ ] T183: Selected session highlights in calendar
- [ ] T184: Selected session date shown on card
- [ ] T185: User can change selected session
- [ ] T186: User must select session before registering
- [ ] T187: "Select a session" button opens calendar
- [ ] T188: Calendar closes after selection
- [ ] T189: Cancel button closes calendar without selection
- [ ] T190: Session selection persists during registration

### 5.2 Session Capacity (10 tests)
- [ ] T191: Session capacity calculated correctly (paid users)
- [ ] T192: Full session shows "Fully Booked" badge
- [ ] T193: Full session shows "Request a Spot" button
- [ ] T194: Non-full session shows "Register" button
- [ ] T195: Session capacity updates in real-time
- [ ] T196: Capacity counts only "paid" registrations
- [ ] T197: Pending/unpaid don't count toward capacity
- [ ] T198: Free registrations count toward capacity
- [ ] T199: Admin can see actual vs paid capacity
- [ ] T200: Capacity 0 means unlimited (if applicable)

### 5.3 Session Start Date Check (10 tests)
- [ ] T201: Session start date checked before registration
- [ ] T202: Session that started shows "Session has started"
- [ ] T203: User cannot register for started session (backend)
- [ ] T204: User cannot register for started session (frontend)
- [ ] T205: Session starting soon still allows registration
- [ ] T206: Session start check uses server time (important!)
- [ ] T207: Timezone differences handled correctly
- [ ] T208: Session start date shown in user's timezone
- [ ] T209: Session start date check on calendar display
- [ ] T210: Started sessions grayed out in calendar

### 5.4 Multiple Sessions (10 tests)
- [ ] T211: User can register for multiple sessions in one schedule
- [ ] T212: Each session tracked separately (scheduleId:sessionId key)
- [ ] T213: User can be pending for session A, paid for session B
- [ ] T214: Registering for session A doesn't affect session B registration
- [ ] T215: Session A full doesn't prevent session B registration
- [ ] T216: Multiple session registrations shown in my-registrations
- [ ] T217: Each session has separate status badge
- [ ] T218: Each session has separate payment status
- [ ] T219: User can view all their session registrations for a schedule
- [ ] T220: Canceling one session doesn't affect others

### 5.5 Session Time & Period (10 tests)
- [ ] T221: Session time displayed correctly (HH:mm format)
- [ ] T222: Session period shown (2hours, 3hours, etc.)
- [ ] T223: Session end time calculated from start + period
- [ ] T224: Session overlaps checked (if user has multiple)
- [ ] T225: Session duration validated on backend
- [ ] T226: Session time format validated
- [ ] T227: Session period enum validated (2hours, 3hours, etc.)
- [ ] T228: Invalid session time rejected
- [ ] T229: Session time shown in 12hr or 24hr based on locale
- [ ] T230: Session timezone displayed

---

## 6. PAYMENT FLOW TESTS (40 Tests)

### 6.1 Free Class Option (10 tests)
- [ ] T231: Admin can mark registration as "free"
- [ ] T232: Free status badge shows correctly
- [ ] T233: Free registration counts toward capacity
- [ ] T234: Free registration gives full access
- [ ] T235: Free registration doesn't require payment
- [ ] T236: Free user receives confirmation email
- [ ] T237: Free status persists across refresh
- [ ] T238: Admin can change paid to free
- [ ] T239: Admin can change free to paid (if needed)
- [ ] T240: Free registration shown in my-registrations

### 6.2 Manual Payment Confirmation (10 tests)
- [ ] T241: Admin can manually confirm payment
- [ ] T242: Manual confirmation changes status to "paid"
- [ ] T243: User notified after manual payment confirmation
- [ ] T244: Payment confirmation timestamp recorded
- [ ] T245: Payment confirmed by admin name recorded
- [ ] T246: Manual payment cannot be undone (or requires special permission)
- [ ] T247: Payment confirmation updates capacity immediately
- [ ] T248: Payment confirmation visible in admin logs
- [ ] T249: Multiple manual confirmations handled
- [ ] T250: Bulk payment confirmation works (if implemented)

### 6.3 Price Display & Validation (10 tests)
- [ ] T251: Schedule price displayed correctly ($X format)
- [ ] T252: Free schedules (price = 0) don't show price
- [ ] T253: Price shown before registration
- [ ] T254: Price validation on backend (min: 0)
- [ ] T255: Negative price rejected
- [ ] T256: Price decimal handling (2 decimal places)
- [ ] T257: Price currency symbol based on locale
- [ ] T258: Price updates reflected immediately
- [ ] T259: Draft schedule price editable
- [ ] T260: Published schedule price locked (or requires special permission)

### 6.4 Payment Status Transitions (10 tests)
- [ ] T261: Unpaid → Pending → Paid flow works
- [ ] T262: Unpaid → Free flow works
- [ ] T263: Pending → Paid flow works
- [ ] T264: Pending → Unpaid reversal works
- [ ] T265: Invalid transitions blocked (e.g., Free → Unpaid)
- [ ] T266: Payment status change triggers email
- [ ] T267: Payment status history tracked (if implemented)
- [ ] T268: Payment status changes logged
- [ ] T269: Multiple status changes handled
- [ ] T270: Status change permissions enforced

---

## 7. EDGE CASES & ERROR HANDLING (30+ Tests)

### 7.1 Network Errors (10 tests)
- [ ] T271: Network timeout handled gracefully
- [ ] T272: No internet connection shows error message
- [ ] T273: Slow network shows loading state
- [ ] T274: Connection lost mid-registration handled
- [ ] T275: Retry mechanism works (if implemented)
- [ ] T276: Offline mode handled (or disabled gracefully)
- [ ] T277: Server down shows maintenance message
- [ ] T278: DNS resolution failure handled
- [ ] T279: CORS errors show appropriate message
- [ ] T280: SSL certificate errors handled

### 7.2 Concurrent Registrations (10 tests)
- [ ] T281: Two users registering for last spot - race condition
- [ ] T282: Same user double-clicking register button
- [ ] T283: User registers from two tabs simultaneously
- [ ] T284: Admin approves while user is viewing
- [ ] T285: Session becomes full while user is selecting
- [ ] T286: Schedule deleted while user is registering
- [ ] T287: Session capacity changed while user is registering
- [ ] T288: Optimistic updates rolled back on error
- [ ] T289: Database transaction ensures consistency
- [ ] T290: 409 Conflict error handled correctly

### 7.3 Data Validation (10 tests)
- [ ] T291: Missing scheduleId rejected
- [ ] T292: Missing sessionId rejected
- [ ] T293: Invalid scheduleId format rejected
- [ ] T294: Invalid sessionId format rejected
- [ ] T295: Non-existent schedule returns 404
- [ ] T296: Non-existent session returns 404
- [ ] T297: Deleted schedule cannot be registered
- [ ] T298: Draft schedule not visible to public
- [ ] T299: Published schedule visible to public
- [ ] T300: Schedule with no sessions handled

### 7.4 UI/UX Edge Cases (10+ tests)
- [ ] T301: Long schedule titles truncated properly
- [ ] T302: Long rejection reasons displayed fully (modal/tooltip)
- [ ] T303: No images shows placeholder
- [ ] T304: Multiple images gallery works
- [ ] T305: Calendar modal responsive on mobile
- [ ] T306: Error messages clear and actionable
- [ ] T307: Success messages auto-dismiss after 5s
- [ ] T308: Loading spinners shown during async operations
- [ ] T309: Buttons disabled during loading
- [ ] T310: Status badges color-coded correctly
- [ ] T311: Accessibility (keyboard navigation, screen readers)
- [ ] T312: Mobile touch interactions work
- [ ] T313: Browser back button doesn't break state
- [ ] T314: Page refresh maintains registration state
- [ ] T315: Deep linking to specific schedule works

---

## PRIORITY TEST GROUPS

### P0 - Critical (Must Pass Before Production)
- All Authentication tests (T001-T050)
- All Registration Status Flow tests (T121-T180)
- Session Start Date Check (T201-T210)
- Payment Status - Paid tests (T173-T180)
- Concurrent Registrations (T281-T290)

### P1 - High Priority
- Verification State tests (T051-T080)
- Session Capacity tests (T191-T200)
- Payment Flow tests (T231-T270)
- Network Errors (T271-T280)

### P2 - Medium Priority
- Token Management details (T081-T120)
- Multiple Sessions (T211-T220)
- Data Validation (T291-T300)

### P3 - Nice to Have
- UI/UX Edge Cases (T301-T315)
- Session Time & Period (T221-T230)
- Payment transitions history

---

## TEST EXECUTION NOTES

1. **Authentication Mocking**: Use mock tokens for expired/invalid scenarios
2. **Database State**: Reset test database between test runs
3. **Concurrent Testing**: Use tools like Artillery or k6 for load testing
4. **Browser Testing**: Test on Chrome, Firefox, Safari, Edge
5. **Mobile Testing**: Test on iOS and Android devices
6. **Accessibility**: Use axe-core or similar for a11y testing
7. **Performance**: Monitor API response times (<200ms target)
8. **Error Logging**: All errors should be logged with context
9. **User Feedback**: Every error should show user-friendly message
10. **Regression**: Re-run all P0 tests after any code change

---

## CURRENT GAPS IDENTIFIED

Based on code review, these scenarios need additional handling:

1. **Token Expiration**: No explicit check before API calls
2. **401 Handling**: Should auto-logout and redirect to login
3. **Rejection Reason**: Not shown to user in frontend
4. **Session Started Check**: Only in RegistrationButton, needs backend validation
5. **Payment Status - Free**: Badge exists but needs testing
6. **Concurrent Registration**: No optimistic locking detected
7. **Network Retry**: No retry mechanism for failed requests
8. **Loading States**: Some buttons may not be disabled during loading
9. **Error Message Consistency**: Different error formats from backend
10. **Status Refresh**: No auto-refresh after status changes

These gaps will be addressed in the implementation phase.
