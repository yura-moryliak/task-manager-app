# Task manager app

Provided requirements:

It should be possible to:

Task minimal data:
 - list/create/edit/delete tasks.
 - name
 - description
 - date of its creation
 - date of its modification
 - state (one of 'in queue' | 'in progress' | 'done')

User minimal data:
 - list/create/edit/delete users
 - name

Tasks can be assigned to users 
1. A task can be assigned to one user only. 
2. A task which is not assigned to any user can take 'in queue' state only. 
3. The same user cannot be assigned to more than one task which is ‘in progress’.  
4. When listing the tasks it should be visible their names, dates of creation and modification, assigned users and states at least
5. When listing the users it should be visible their names and assigned tasks at least
6. Data storing can be done into memory or browser's storage. 
