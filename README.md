# project10_react_frontend_final
The final project in TH javascript full-stack.

## Steps
1. npm create vite@latest
2. allow install of `create-vite@5.2.3`
3. Move Vite files and folders to /client
4. Move express backend to /api
5. `npm i` in /client and /api
6. `npm i cors` in /api for cross origin sharing between :5000 and :5173
7. `npm i react-router-dom` in /client
8. `npm i react-markdown` in /client
9. delete src/assets, app.jss and index.css
10. create src/components/
11. Add styles/ project folder to src/
12. In main.jsx delete index.css import .
13. In main.jsx import reset.css and global.css
14. Delete everything from app.jsx except hello world
15. Build out and import the Header.jsx component
- establish the isSignedOut variable
- wrap the ul in a jsx ternary to render based on signed in 
or not state
- destructured href and username as props
16. Build out the course component as shown in index.png and index.html
- utilize an array to hold the course hrefs and titles and pass as destructured props.
17. Build out a CourseList component that maps over the courses
18. Build out a MainComponent that imports the CourseList
19. Export the MainComponent to App.jsx to render the courses
20. Added rule to .eslintrc.cjs to ignore proptypes rules
21. 