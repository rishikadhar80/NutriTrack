#!/usr/bin/env node

/**
 * NutriTrack Backend - Pre-Deployment Test Suite
 * Run this script to verify all endpoints and configurations
 * Usage: node test-deployment.js
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const isHttps = BASE_URL.startsWith('https');
const client = isHttps ? https : http;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    };

    const req = client.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
            rawBody: responseData,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseData,
            error: 'Invalid JSON response',
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  log('\n=== NutriTrack Backend Pre-Deployment Test Suite ===\n', 'blue');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      path: '/api/health',
      expectedStatus: 200,
      expectFields: ['status', 'timestamp'],
    },
    {
      name: 'Database Connection (Auth Login - should fail with invalid credentials)',
      method: 'POST',
      path: '/api/auth/login',
      data: { email: 'nonexistent@test.com', password: 'wrongpassword' },
      expectedStatus: [401, 400], // Either unauthorized or bad request
      description: 'Tests if auth route is accessible and database responds',
    },
  ];

  let passedTests = 0;
  let failedTests = 0;
  const results = [];

  log(`Testing: ${BASE_URL}\n`, 'yellow');

  for (const test of tests) {
    try {
      log(`Testing: ${test.name}...`, 'yellow');

      const response = await makeRequest(test.method, test.path, test.data);
      const expectedStatuses = Array.isArray(test.expectedStatus)
        ? test.expectedStatus
        : [test.expectedStatus];

      if (expectedStatuses.includes(response.status)) {
        log(`✓ PASS - Status ${response.status}`, 'green');

        if (test.expectFields) {
          const missingFields = test.expectFields.filter((field) => !(field in response.body));
          if (missingFields.length === 0) {
            log(`  ✓ All expected fields present`, 'green');
          } else {
            log(`  ⚠ Missing fields: ${missingFields.join(', ')}`, 'yellow');
          }
        }

        passedTests++;
        results.push({ test: test.name, status: 'PASSED' });
      } else {
        log(
          `✗ FAIL - Expected status ${expectedStatuses.join(' or ')}, got ${response.status}`,
          'red'
        );
        log(`  Response: ${JSON.stringify(response.body).substring(0, 200)}`, 'red');
        failedTests++;
        results.push({ test: test.name, status: 'FAILED' });
      }
    } catch (error) {
      log(`✗ ERROR - ${error.message}`, 'red');
      failedTests++;
      results.push({ test: test.name, status: 'ERROR', error: error.message });
    }
    console.log('');
  }

  // Environment variables check
  log('=== Environment Variables Check ===\n', 'blue');
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GROQ_API_KEY',
    'NODE_ENV',
    'FRONTEND_URL',
  ];

  let envVarsOk = true;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      const value = envVar === 'MONGODB_URI' ? '***' : process.env[envVar].substring(0, 20) + '...';
      log(`✓ ${envVar}: ${value}`, 'green');
    } else {
      log(`✗ ${envVar}: NOT SET`, 'red');
      envVarsOk = false;
    }
  }

  // Configuration check
  log('\n=== Configuration Check ===\n', 'blue');
  const configChecks = [
    {
      name: 'Node.js Environment',
      value: process.env.NODE_ENV || 'not set',
      expected: ['development', 'production'],
    },
    {
      name: 'API Base URL',
      value: BASE_URL,
      expected: [BASE_URL],
    },
  ];

  for (const check of configChecks) {
    const isValid = check.expected.some(
      (e) => check.value.toLowerCase().includes(e.toLowerCase()) || check.value === e
    );
    if (isValid) {
      log(`✓ ${check.name}: ${check.value}`, 'green');
    } else {
      log(`⚠ ${check.name}: ${check.value} (expected: ${check.expected.join(' or ')})`, 'yellow');
    }
  }

  // Summary
  log('\n=== Test Summary ===\n', 'blue');
  log(`Total Tests: ${passedTests + failedTests}`, 'yellow');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');

  if (envVarsOk && failedTests === 0) {
    log('\n✓ All tests passed! Ready for deployment.', 'green');
    process.exit(0);
  } else {
    log('\n✗ Some tests failed. Fix issues before deployment.', 'red');
    process.exit(1);
  }
}

runTests();
