
---
# 🧑‍🎓 Student Life Toolkit

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**STUDENT-TOOLKIT** is a **React + TypeScript** application designed to simplify student life. It integrates tools for **class scheduling, budgeting, exam prep, study planning, and motivation**, helping students manage their academic and personal tasks efficiently.

---

## 🌟 Features

### 🏫 Class Schedule Tracker
- ✅ Add, edit, delete classes  
- ✅ Track subject, instructor, day & time  
- ✅ Color-coded for easy visualization  
- ✅ Mobile-friendly responsive UI  

### 💰 Budget Tracker
- ✅ Track income (allowance, scholarships, part-time jobs)  
- ✅ Track expenses (food, transport, books, entertainment)  
- ✅ Visual summaries using charts  
- ✅ Data persistence for long-term tracking  

### 📝 Exam Q&A Generator
- ✅ Generate random practice questions (MCQs, Short answers, True/False)  
- ✅ Set difficulty: Easy, Medium, Hard  
- ✅ Helps improve exam readiness  

### 📚 Study Planner
- ✅ Break study goals into tasks  
- ✅ Assign subject/topic, priority, time, and deadlines  
- ✅ Track progress and completion  

### 🌈 Motivational Feature (Unique)
- ✅ Daily motivational quotes and study tips  
- ✅ Encourages consistent productivity  
- ✅ Can be expanded with streaks or gamification  

---

## 📸 Screenshots

<div align="center">

<table>
<tr>
<td>

**Home Page**  
<img src="https://github.com/user-attachments/assets/8adedf28-4b67-4b1a-aa2c-cee2bcc8a42b" width="300" />

</td>
<td>

**Schedule Tracker**  
<img src="https://github.com/user-attachments/assets/5a3d1221-661a-4eff-bc1b-8c0004858f21" width="300" />

</td>
</tr>
<tr>
<td>

**Budget Tracker**  
<img src="https://github.com/user-attachments/assets/84b5e90c-2f00-46e1-b111-6ff11a03d415" width="300" />

</td>
<td>

**Exam Q&A Generator**  
<img src="https://github.com/user-attachments/assets/a1392faf-78c1-436b-8f9a-65c080ccddd0" width="300" />

</td>
</tr>
<tr>
<td>

**Study Planner**  
<img src="https://github.com/user-attachments/assets/596bc80b-3a48-49c0-892a-c54ca4f04518" width="300" />

</td>
<td>

**Motivation & Tips**  
<img src="https://github.com/user-attachments/assets/9bfb72e0-96de-427a-a492-bea80156ae6c" width="300" />

</td>
</tr>
</table>

</div>


</div>

## 🛠️ Tech Stack

**Frontend:** React.js, TypeScript, Tailwind CSS, Axios, Context API  
**Backend:** Node.js, Express.js, MongoDB, JWT Authentication  
**Libraries & Tools:** SweetAlert2, Chart.js / Recharts, Vite, Responsive UI  

---

## 📂 Project Structure

```

STUDENT-TOOLKIT/
├── src/
│   ├── api/
│   │   └── axios.ts
│   ├── assets/
│   ├── components/
│   │   ├── budget/
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   ├── IncomeForm.tsx
│   │   │   ├── IncomeList.tsx
│   │   │   └── Summary.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── ExamAQ/
│   │   │   ├── QuestionForm.tsx
│   │   │   └── Questionlist.tsx
│   │   ├── Home/
│   │   │   └── Hero.tsx
│   │   ├── motivation/
│   │   │   └── MotivationCard.tsx
│   │   ├── schedules/
│   │   │   ├── ScheduleForm.tsx
│   │   │   └── ScheduleList.tsx
│   │   ├── Study/
│   │   │   ├── StudyCard.tsx
│   │   │   ├── StudyForm.tsx
│   │   │   └── StudyList.tsx
│   │   └── layouts/
│   │       ├── footer.tsx
│   │       └── navbar.tsx
│   ├── lib/
│   ├── pages/
│   │   ├── Budgets/
│   │   │   └── BudgetPage.tsx
│   │   ├── ExamQA/
│   │   │   └── ExamQA.tsx
│   │   ├── Home/
│   │   │   └── Home.tsx
│   │   ├── Login/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── motivation/
│   │   │   └── Motivation.tsx
│   │   ├── Schedule/
│   │   │   └── SchedulePage.tsx
│   │   └── study/
│   │       └── StudyPlannerPage.tsx
│   ├── routes/
│   │   └── routes.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── components.json
├── eslint.config.js
└── index.html
````

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Tahsina2226/student_toolkit.git
cd student_toolkit

````

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start frontend development server

```bash
npm run dev
```

### 4. Backend Setup


1. Clone the backend repository (if not already cloned separately):
```bash
git clone https://github.com/Tahsina2226/Student_life_toolkit.git

cd Student_life_toolkit

npm install
```

3. Create `.env` file:

```
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
JWT_SECRET=<your-secret-key>
```

4. Start backend server:

```bash
npm run start
```

---

## 🌐 Live Demo & Links

**Frontend (Live Demo):**  
[![Frontend](https://img.shields.io/badge/Frontend-blue?style=for-the-badge&logo=react)](https://studenttoolkit.vercel.app)

**Backend:**  
[![Backend](https://img.shields.io/badge/Backend-purple?style=for-the-badge&logo=node.js)](https://student-toolkit.vercel.app/)


## 📁 Repository

**Frontend Repository:**  
[![GitHub](https://img.shields.io/badge/Frontend-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Tahsina2226/student_toolkit)

**Backend Repository:**  
[![GitHub](https://img.shields.io/badge/Backend-Repository-purple?style=for-the-badge&logo=github)](https://github.com/Tahsina2226/Student_life_toolkit)



---

## 🔮 Future Enhancements

* 🔹 Add **notifications/reminders** for class & study tasks
* 🔹 Include **expense prediction** using charts
* 🔹 Enable **user profile & multi-account support**
* 🔹 Integrate **calendar view** for schedules and study plans
* 🔹 Gamify the motivational streaks & productivity points

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome!
Feel free to **fork the project**, submit PRs, or suggest improvements.

---

## 👩‍💻 Author

**Tahsina Tanvin**

* Email: [tahsinatanvin274@gmail.com](mailto:tahsinatanvin274@gmail.com)
* LinkedIn: [Tahsina Tanvin](https://www.linkedin.com/in/tahsina-tanvin-8a49162b3/)
* GitHub: [Tahsina2226](https://github.com/Tahsina2226)

```

