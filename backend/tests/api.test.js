const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('  TASKFLOW BACKEND INTEGRATION TEST SUITE');
  console.log('==================================================\n');

  let token = null;
  let testProjectId = null;
  let testTaskId = null;
  const testEmail = `test_${Date.now()}@taskflow.dev`;
  const testPassword = 'Password123!';

  try {
    // 1. Health Check
    console.log('[1/12] Testing GET /api/health...');
    const health = await request('GET', '/health');
    console.assert(health.status === 200, `Health check failed with status ${health.status}`);
    console.log('✓ Health check passed.\n');

    // 2. Register User
    console.log('[2/12] Testing POST /api/auth/register...');
    const regRes = await request('POST', '/auth/register', {
      fullName: 'Integration Test User',
      email: testEmail,
      password: testPassword
    });
    console.assert(regRes.status === 201, `Register failed: ${JSON.stringify(regRes.body)}`);
    console.assert(!regRes.body.data.user.password, 'Password hash exposed in register response!');
    token = regRes.body.data.token;
    console.log('✓ Registration passed. Token acquired.\n');

    // 3. Get User Profile
    console.log('[3/12] Testing GET /api/auth/me...');
    const meRes = await request('GET', '/auth/me', null, { Authorization: `Bearer ${token}` });
    console.assert(meRes.status === 200, `Profile check failed: ${JSON.stringify(meRes.body)}`);
    console.log(`✓ Profile check passed for user: ${meRes.body.data.user.email}\n`);

    // 4. Create Project
    console.log('[4/12] Testing POST /api/projects...');
    const projRes = await request('POST', '/projects', {
      name: 'Test Automation Project',
      description: 'Project created via end-to-end integration test runner',
      status: 'In Progress',
      startDate: '2026-09-01',
      endDate: '2026-12-31'
    }, { Authorization: `Bearer ${token}` });
    console.assert(projRes.status === 201, `Create project failed: ${JSON.stringify(projRes.body)}`);
    testProjectId = projRes.body.data.id;
    console.log(`✓ Project created successfully (ID: ${testProjectId}).\n`);

    // 5. Get Projects List
    console.log('[5/12] Testing GET /api/projects...');
    const projList = await request('GET', '/projects', null, { Authorization: `Bearer ${token}` });
    console.assert(projList.status === 200 && projList.body.data.length > 0, 'Failed to retrieve projects list.');
    console.log(`✓ Retrieved ${projList.body.data.length} project(s).\n`);

    // 6. Create Task under Project
    console.log('[6/12] Testing POST /api/tasks...');
    const taskRes = await request('POST', '/tasks', {
      projectId: testProjectId,
      name: 'Execute Integration Tests',
      description: 'Automated test execution task',
      priority: 'High',
      status: 'Pending',
      dueDate: '2026-10-15'
    }, { Authorization: `Bearer ${token}` });
    console.assert(taskRes.status === 201, `Create task failed: ${JSON.stringify(taskRes.body)}`);
    testTaskId = taskRes.body.data.id;
    console.log(`✓ Task created successfully (ID: ${testTaskId}).\n`);

    // 7. Get Tasks List with Filtering
    console.log('[7/12] Testing GET /api/tasks (filter by priority)...');
    const taskList = await request('GET', `/tasks?priority=High&projectId=${testProjectId}`, null, { Authorization: `Bearer ${token}` });
    console.assert(taskList.status === 200 && taskList.body.data.length > 0, 'Task filtering failed.');
    console.log(`✓ Retrieved ${taskList.body.data.length} task(s) matching filter.\n`);

    // 8. Update Task Status
    console.log('[8/12] Testing PUT /api/tasks/:id...');
    const updateTaskRes = await request('PUT', `/tasks/${testTaskId}`, {
      status: 'Completed'
    }, { Authorization: `Bearer ${token}` });
    console.assert(updateTaskRes.status === 200 && updateTaskRes.body.data.status === 'Completed', 'Update task failed.');
    console.log('✓ Task updated to Completed status.\n');

    // 9. Dashboard Metrics Calculation
    console.log('[9/12] Testing GET /api/dashboard...');
    const dashRes = await request('GET', '/dashboard', null, { Authorization: `Bearer ${token}` });
    console.assert(dashRes.status === 200, `Dashboard metrics failed: ${JSON.stringify(dashRes.body)}`);
    console.log('✓ Dashboard metrics retrieved successfully:');
    console.log(`   - Total Projects: ${dashRes.body.data.totalProjects}`);
    console.log(`   - Projects In Progress: ${dashRes.body.data.projectsInProgress}`);
    console.log(`   - Total Tasks: ${dashRes.body.data.totalTasks}`);
    console.log(`   - Completed Tasks: ${dashRes.body.data.completedTasks}\n`);

    // 10. Delete Task
    console.log('[10/12] Testing DELETE /api/tasks/:id...');
    const delTaskRes = await request('DELETE', `/tasks/${testTaskId}`, null, { Authorization: `Bearer ${token}` });
    console.assert(delTaskRes.status === 200, `Delete task failed: ${JSON.stringify(delTaskRes.body)}`);
    console.log('✓ Task deleted successfully.\n');

    // 11. Delete Project
    console.log('[11/12] Testing DELETE /api/projects/:id...');
    const delProjRes = await request('DELETE', `/projects/${testProjectId}`, null, { Authorization: `Bearer ${token}` });
    console.assert(delProjRes.status === 200, `Delete project failed: ${JSON.stringify(delProjRes.body)}`);
    console.log('✓ Project deleted successfully.\n');

    // 12. Unauthenticated Request Check
    console.log('[12/12] Testing Unauthenticated Access Security...');
    const unauth = await request('GET', '/projects');
    console.assert(unauth.status === 401, `Unauthenticated check failed! Returned status ${unauth.status}`);
    console.log('✓ Security check passed (401 Unauthorized returned).\n');

    console.log('==================================================');
    console.log('  ALL 12 INTEGRATION TESTS PASSED SUCCESSFULLY!  ');
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('Integration test failed with exception:', error);
    process.exit(1);
  }
}

runTests();
