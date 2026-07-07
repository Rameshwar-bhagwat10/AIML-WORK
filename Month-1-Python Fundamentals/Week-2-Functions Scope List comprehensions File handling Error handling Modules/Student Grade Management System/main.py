from file_handler import load_students, save_students
from student import (
    add_student,
    view_students,
    search_student,
    find_topper,
    show_statistics,
    edit_student,
    delete_student
)

def menu():

    print("\n====================================")
    print("   Student Grade Management System")
    print("====================================")

    print("1. Add Student")
    print("2. View Students")
    print("3. Search Student")
    print("4. Find Topper")
    print("5. Statistics")
    print("6. Edit Student")
    print("7. Delete Student")
    print("8. Exit")

    return input("\nEnter your choice: ")

students = load_students()

while True:

    choice = menu()

    if choice == "1":

        add_student(students)
        save_students(students)

    elif choice == "2":

        view_students(students)

    elif choice == "3":

        search_student(students)

    elif choice == "4":

        find_topper(students)

    elif choice == "5":

        show_statistics(students)
    
    elif choice == "6":

        edit_student(students)
        save_students(students)

    elif choice == "7":

        delete_student(students)
        save_students(students)

    elif choice == "8":

        print("\nThank you!")

        break

    else:

        print("Invalid Choice")