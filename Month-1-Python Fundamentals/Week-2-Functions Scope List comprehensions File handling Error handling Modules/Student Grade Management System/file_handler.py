def load_students():
    students=[]
    with open("grades.txt","r") as file:
        for line in file:
            line=line.strip()

            if line=="":
                continue
            parts=line.split(",")
            name=parts[0]
            marks=[int(marks) for marks in parts[1:]]

            student={
                "name":name,
                "marks":marks
            }
            students.append(student)

    return students

def save_students(students):
    with open("grades.txt", "w") as file:

        for student in students:

            line = student["name"]

            for mark in student["marks"]:
                line += f",{mark}"

            file.write(line + "\n")