const axios = require('axios');

async function testCrudOperations() {
    try {
        // Create a new user
        const createResponse = await axios.post('http://localhost:3000/users', {
            name: 'John Doe',
            email: 'john@example.com',
            address: '123 Main St'
        });
        console.log('Create User Response:', createResponse.data);

        const userId = createResponse.data.id;

        // Get all users
        const getAllResponse = await axios.get('http://localhost:3000/users');
        console.log('Get All Users Response:', getAllResponse.data);

        // Get user by ID
        const getByIdResponse = await axios.get(`http://localhost:3000/users/${userId}`);
        console.log('Get User by ID Response:', getByIdResponse.data);

        // Update the user
        const updateResponse = await axios.put(`http://localhost:3000/users/${userId}`, {
            name: 'Harris',
            email: 'harris@fake.com',
            address: 'leof. alexandras 120'
        });
        console.log('Update User Response:', updateResponse.data);

        // Delete the user
        const deleteResponse = await axios.delete(`http://localhost:3000/users/${userId}`);
        console.log('Delete User Response:', deleteResponse.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testCrudOperations();
