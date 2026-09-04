import mongoose from 'mongoose';
import User from './models/User.model.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const API_URL = 'http://localhost:5000/api/v1';

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

async function runTests() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  try {
    // 1. Create a student and an admin user (directly via mongoose to bypass OTP for testing)
    await User.deleteMany({ email: { $in: ['test_student@vitapstudent.ac.in', 'test_admin@vitapstudent.ac.in'] } });

    const student = await User.create({
      name: 'Test Student',
      email: 'test_student@vitapstudent.ac.in',
      password: 'Password123!',
      role: 'student',
      isVerified: true,
      status: 'ACTIVE'
    });

    const admin = await User.create({
      name: 'Test Admin',
      email: 'test_admin@vitapstudent.ac.in',
      password: 'Password123!',
      role: 'admin',
      isVerified: true,
      status: 'ACTIVE'
    });

    // 2. Login as student
    const studentRes = await fetchJSON(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'test_student@vitapstudent.ac.in', password: 'Password123!' })
    });
    const studentToken = studentRes.data.accessToken;

    // 3. Login as admin
    const adminRes = await fetchJSON(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'test_admin@vitapstudent.ac.in', password: 'Password123!' })
    });
    const adminToken = adminRes.data.accessToken;

    console.log('\n--- SECURITY TESTS ---');

    // TEST 1: Student attempts to access admin users
    try {
      await fetchJSON(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.error('❌ Test 1 Failed: Student was able to access admin users.');
    } catch (err) {
      if (err.status === 403) {
        console.log('✅ Test 1 Passed: Student received 403 Forbidden on /admin/users');
      } else {
        console.error('❌ Test 1 Failed with wrong status:', err.status);
      }
    }

    // TEST 2: Student attempts to suspend a user
    try {
      await fetchJSON(`${API_URL}/admin/users/${student._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'SUSPENDED' }),
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.error('❌ Test 2 Failed: Student was able to suspend user.');
    } catch (err) {
      if (err.status === 403) {
        console.log('✅ Test 2 Passed: Student received 403 Forbidden when trying to suspend user.');
      } else {
        console.error('❌ Test 2 Failed with wrong status:', err.status);
      }
    }

    // TEST 3: Unauthenticated request to admin API
    try {
      await fetchJSON(`${API_URL}/admin/dashboard`);
      console.error('❌ Test 3 Failed: Unauthenticated user accessed admin API.');
    } catch (err) {
      if (err.status === 401) {
        console.log('✅ Test 3 Passed: Unauthenticated user received 401 Unauthorized.');
      } else {
        console.error('❌ Test 3 Failed with wrong status:', err.status);
      }
    }

    // TEST 4: Admin accesses dashboard
    try {
      const data = await fetchJSON(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.data.kpis) {
        console.log('✅ Test 4 Passed: Admin received 200 OK and KPI data on dashboard.');
      }
    } catch (err) {
      console.error('❌ Test 4 Failed:', err.message);
    }

    // TEST 5: Admin tries to suspend the student
    try {
      const data = await fetchJSON(`${API_URL}/admin/users/${student._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'SUSPENDED' }),
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.data.status === 'SUSPENDED') {
        console.log('✅ Test 5 Passed: Admin successfully suspended the student.');
      }
    } catch (err) {
      console.error('❌ Test 5 Failed:', err.message);
    }

    // TEST 6: Suspended student tries to login
    try {
      await fetchJSON(`${API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: 'test_student@vitapstudent.ac.in', password: 'Password123!' })
      });
      console.error('❌ Test 6 Failed: Suspended student was able to login.');
    } catch (err) {
      if (err.status === 403) {
        console.log('✅ Test 6 Passed: Suspended student received 403 Forbidden on login.');
      } else {
        console.error('❌ Test 6 Failed with wrong status:', err.status);
      }
    }

    // Cleanup
    await User.deleteMany({ email: { $in: ['test_student@vitapstudent.ac.in', 'test_admin@vitapstudent.ac.in'] } });
    console.log('\nTests completed and test data cleaned up.');
    process.exit(0);
  } catch (error) {
    console.error('Test script crashed:', error);
    process.exit(1);
  }
}

runTests();
