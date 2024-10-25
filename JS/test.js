let student = {
    name: "Marie",
    age: 20,
    courses: []
};

student.age = 21;
student.grade = "A";

student.courses.push("Math", "Physics", "Chemistry");

let physicsIndex = student.courses.indexOf("Physics");

let slicedCourses = student.courses.slice(0, 2);

console.log(student);
console.log(physicsIndex);
console.log(slicedCourses);
