from utils import calculate_average, calculate_grade


def view_students(students):
    """
    Display all students with marks, average and grade.
    """

    if len(students) == 0:
        print("\nNo students found.\n")
        return

    print("\n========== STUDENT RECORDS ==========\n")

    for student in students:

        average = calculate_average(student["marks"])
        grade = calculate_grade(average)

        print("-" * 40)
        print(f"Name    : {student['name']}")
        print(f"Marks   : {student['marks']}")
        print(f"Average : {average:.2f}")
        print(f"Grade   : {grade}")

    print("-" * 40)


def add_student(students):
    name = input("Enter student name: ")

    marks = []

    for i in range(3):
        while True:
            try:
                mark = int(input(f"Enter mark {i+1}: "))

                if mark < 0 or mark > 100:
                    print("Marks must be between 0 and 100.")
                    continue

                marks.append(mark)
                break

            except ValueError:
                print("Please enter a valid integer.")

    student = {
        "name": name,
        "marks": marks
    }

    students.append(student)

    print("\nStudent added successfully!")


def search_student(students):
    """
    Search a student by name.
    """

    search_name = input("Enter student name: ").strip().lower()

    found = False

    for student in students:

        if student["name"].lower() == search_name:

            average = calculate_average(student["marks"])
            grade = calculate_grade(average)

            print("\nStudent Found")
            print("-" * 35)
            print(f"Name    : {student['name']}")
            print(f"Marks   : {student['marks']}")
            print(f"Average : {average:.2f}")
            print(f"Grade   : {grade}")

            found = True
            break

    if not found:
        print("\nStudent not found.")


def find_topper(students):
    """
    Find student with highest average.
    """

    if len(students) == 0:
        print("No students available.")
        return

    topper = students[0]

    highest_average = calculate_average(topper["marks"])

    for student in students:

        average = calculate_average(student["marks"])

        if average > highest_average:

            highest_average = average
            topper = student

    print("\n🏆 CLASS TOPPER")
    print("-" * 35)
    print(f"Name    : {topper['name']}")
    print(f"Average : {highest_average:.2f}")
    print(f"Grade   : {calculate_grade(highest_average)}")


def show_statistics(students):
    """
    Display class statistics.
    """

    if len(students) == 0:
        print("No students available.")
        return

    averages = [
        calculate_average(student["marks"])
        for student in students
    ]

    print("\nCLASS STATISTICS")
    print("-" * 35)

    print(f"Total Students : {len(students)}")
    print(f"Highest Average: {max(averages):.2f}")
    print(f"Lowest Average : {min(averages):.2f}")
    print(f"Class Average  : {sum(averages)/len(averages):.2f}")


def edit_student(students):
    """
    Edit an existing student's marks.
    """

    name = input("Enter student name to edit: ").strip().lower()

    for student in students:

        if student["name"].lower() == name:

            print("\nCurrent Marks:", student["marks"])

            new_marks = []

            for i in range(3):

                while True:

                    try:

                        mark = int(input(f"Enter New Mark {i+1}: "))

                        if mark < 0 or mark > 100:
                            print("Marks must be between 0 and 100.")
                            continue

                        new_marks.append(mark)
                        break

                    except ValueError:
                        print("Invalid input.")

            student["marks"] = new_marks

            print("\nStudent Updated Successfully.")

            return

    print("\nStudent Not Found.")


def delete_student(students):
    """
    Delete a student.
    """

    name = input("Enter student name: ").strip().lower()

    for student in students:

        if student["name"].lower() == name:

            students.remove(student)

            print("\nStudent Deleted.")

            return

    print("\nStudent Not Found.")