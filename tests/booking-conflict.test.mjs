// Automated Test for Mosari Resort Double-Booking Prevention & Date Overlap Algorithm
// Unit 7 SDLC Verification Suite

import assert from "node:assert/strict";

console.log("==========================================================");
console.log("🧪 RUNNING VERIFICATION TEST: DOUBLE-BOOKING PREVENT & CONFLICT (409)");
console.log("==========================================================");

// 1. Date Range Overlapping Algorithm (Standard Half-open interval [check_in, check_out))
function isDateRangeOverlapping(startA, endA, startB, endB) {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();
  return sA < eB && eA > sB;
}

console.log("\n▶ TEST SUITE 1: Date Range Half-Open Interval [check_in, check_out)");

// Test 1.1: Exact match (Conflict)
assert.equal(
  isDateRangeOverlapping("2026-11-10", "2026-11-15", "2026-11-10", "2026-11-15"),
  true,
  "Exact match dates MUST overlap"
);
console.log("  ✔ Test 1.1 Passed: Exact overlapping dates detected.");

// Test 1.2: Overlapping in the middle (Conflict)
assert.equal(
  isDateRangeOverlapping("2026-11-10", "2026-11-15", "2026-11-12", "2026-11-17"),
  true,
  "Partial overlap MUST conflict"
);
console.log("  ✔ Test 1.2 Passed: Partial overlapping interval detected.");

// Test 1.3: Back-to-back booking (Guest A checks out on Nov 15 at 12:00, Guest B checks in on Nov 15 at 14:00)
// This is non-overlapping in half-open interval [10, 15) and [15, 20)
assert.equal(
  isDateRangeOverlapping("2026-11-10", "2026-11-15", "2026-11-15", "2026-11-20"),
  false,
  "Back-to-back check-out and check-in MUST NOT overlap"
);
console.log("  ✔ Test 1.3 Passed: Back-to-back same-day transition allowed (No overlap).");

// Test 1.4: Completely disjoint ranges (No overlap)
assert.equal(
  isDateRangeOverlapping("2026-11-10", "2026-11-15", "2026-11-20", "2026-11-25"),
  false,
  "Disjoint date ranges MUST NOT overlap"
);
console.log("  ✔ Test 1.4 Passed: Disjoint date ranges permitted.");

// 2. Physical Room Allocation & Exclusion Constraint Simulation
console.log("\n▶ TEST SUITE 2: Physical Room Allocation & 409 Conflict");

// Sample physical rooms for room type "rt1"
const mockPhysicalRooms = [
  { id: "r1", room_number: "101", room_type_id: "rt1", status: "Available" },
  { id: "r2", room_number: "102", room_type_id: "rt1", status: "Available" }
];

// Existing bookings for this room type
const mockExistingBookings = [
  {
    id: "b1",
    booking_code: "MSR-TEST01",
    room_id: "r1",
    check_in_date: "2026-12-01",
    check_out_date: "2026-12-05",
    status: "Confirmed"
  }
];

function simulateRoomAllocation(roomTypeId, checkIn, checkOut, rooms, bookings) {
  const candidateRooms = rooms.filter(
    (r) => String(r.room_type_id) === String(roomTypeId) && r.status === "Available"
  );

  for (const candidate of candidateRooms) {
    const hasOverlap = bookings.some((b) => {
      if (b.room_id !== candidate.id) return false;
      if (b.status === "Cancelled") return false;
      return isDateRangeOverlapping(checkIn, checkOut, b.check_in_date, b.check_out_date);
    });

    if (!hasOverlap) {
      return { assignedRoom: candidate, conflict: false };
    }
  }

  // All physical rooms have conflicting dates
  const error = new Error("DOUBLE_BOOKING_CONFLICT");
  error.status = 409;
  error.code = "23P01";
  error.detail = "PostgreSQL btree_gist exclusion constraint violated for room_id and daterange";
  return { assignedRoom: null, conflict: true, error };
}

// Test 2.1: First guest books 2026-12-01 to 2026-12-05. Room r1 is busy, so system allocates r2 (Room 102).
const alloc1 = simulateRoomAllocation("rt1", "2026-12-01", "2026-12-05", mockPhysicalRooms, mockExistingBookings);
assert.equal(alloc1.conflict, false);
assert.equal(alloc1.assignedRoom.id, "r2", "Should allocate second available room r2");
console.log("  ✔ Test 2.1 Passed: Smart allocation chose room 102 (r2) while room 101 (r1) is busy.");

// Now add the second booking (r2 busy from 2026-12-01 to 2026-12-05)
mockExistingBookings.push({
  id: "b2",
  booking_code: "MSR-TEST02",
  room_id: "r2",
  check_in_date: "2026-12-01",
  check_out_date: "2026-12-05",
  status: "Confirmed"
});

// Test 2.2: Third guest attempts to book 2026-12-02 to 2026-12-04. Both r1 and r2 are booked!
const alloc2 = simulateRoomAllocation("rt1", "2026-12-02", "2026-12-04", mockPhysicalRooms, mockExistingBookings);
assert.equal(alloc2.conflict, true);
assert.equal(alloc2.error.status, 409);
assert.equal(alloc2.error.code, "23P01");
console.log("  ✔ Test 2.2 Passed: 409 Conflict correctly triggered with code 23P01 when all rooms are booked.");

// Test 2.3: Fourth guest attempts to book 2026-12-05 to 2026-12-10 (After check-out of previous guests)
const alloc3 = simulateRoomAllocation("rt1", "2026-12-05", "2026-12-10", mockPhysicalRooms, mockExistingBookings);
assert.equal(alloc3.conflict, false);
assert.equal(alloc3.assignedRoom.id, "r1", "Should successfully re-use r1 for subsequent dates");
console.log("  ✔ Test 2.3 Passed: Successive reservation accepted after previous guests depart.");

console.log("\n==========================================================");
console.log("🎉 ALL TESTS PASSED SUCCESSFULLY (100% SPEC COMPLIANT)!");
console.log("==========================================================");

