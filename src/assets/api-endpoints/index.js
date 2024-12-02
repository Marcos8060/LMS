//------------------------ Backend APIs ----------------------//
export const API_URL = {


    /***************** AUTHENTICATION APIS **********************/
    LOGIN: 'http://localhost:3000/api/login',
    

    /***************** PROFILE APIS **********************/
    FETCH_PROFILE_DETAILS: 'http://localhost:3000/api/get-profile',
    ADD_PROFILE_DETAILS: 'http://localhost:3000/api/create-profile',
    UPDATE_PROFILE_DETAILS: 'http://localhost:3000/api/update-profile',


    /***************** USERS APIS **********************/
    FETCH_USERS: 'http://localhost:3000/api/users',
    CREATE_USERS: 'http://localhost:3000/api/register',
    DELETE_USER: 'http://localhost:3000/api/delete-user',
    EDIT_USER: 'http://localhost:3000/api/edit-user',


    /***************** EMPLOYEE APIS **********************/
    FETCH_USER_LEAVE: 'http://localhost:3000/api/get-leave',
    FETCH_ALL_LEAVES: 'http://localhost:3000/api/fetch-all-leaves',
    ADD_LEAVE: 'http://localhost:3000/api/create-leave',
    UPDATE_LEAVE: 'http://localhost:3000/api/update-leave',
    DELETE_LEAVE: 'http://localhost:3000/api/delete-leave',


    /***************** JOBS APIS **********************/
    FETCH_JOBS: 'http://localhost:3000/api/get-jobs',
    APPLY_JOB: 'http://localhost:3000/api/send-application',
   

}


//------------------------ Application APIs ----------------------//
export const APP_API_URL = {

    /***************** AUTH **********************/
    LOGIN: '/api/login',

    /***************** PROFILE **********************/
    FETCH_PROFILE_DETAILS: '/api/profile/get-profile',
    ADD_PROFILE_DETAILS: '/api/profile/create-profile',
    UPDATE_PROFILE_DETAILS: '/api/profile/update-profile',


    /***************** USERS **********************/
    FETCH_USERS: '/api/users/fetch-users',
    CREATE_USERS: '/api/users/create-user',
    DELETE_USER: '/api/users/delete-user',
    EDIT_USER: '/api/users/edit-user',


    /***************** LEAVE **********************/
    FETCH_USER_LEAVE: '/api/employee/fetch-user-leave',
    FETCH_ALL_LEAVES: '/api/employee/fetch-all-leaves',
    ADD_LEAVE: '/api/employee/add-leave',
    UPDATE_LEAVE: '/api/employee/update-leave',
    DELETE_LEAVE: '/api/employee/delete-leave',
   

     /***************** JOBS **********************/
     FETCH_JOBS: '/api/jobs/fetch-jobs',
     APPLY_JOB: '/api/jobs/apply-job',
}

export const API_METHODS = {
    GET:'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE'
}
