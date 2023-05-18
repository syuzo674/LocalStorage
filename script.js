$(document).ready(function () {
    const currentDate = new Date();

    const calendar = $("#calendar-body"); // カレンダーの要素
    const currentMonth = $("#current-month"); // 現在の月を表示する要素
    const prevMonthBtn = $("#prev-month-btn"); // 前の月ボタン
    const nextMonthBtn = $("#next-month-btn"); // 次の月ボタン

    const dateInput = $("#date-input"); // 日付入力欄
    const taskInput = $("#task-input"); // タスク入力欄
    const addTaskBtn = $("#add-todo-btn"); // todo追加ボタン
    const taskList = $("#todo-list"); // todoリストの要素
    const clearAllBtn = $("#clear-all-btn"); // 全タスク削除ボタン


    prevMonthBtn.click(function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        displayCalendar(); // カレンダーの表示を更新
        updateCalendarHeader(); // カレンダーのヘッダーを更新
    });

    nextMonthBtn.click(function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        displayCalendar(); // カレンダーの表示を更新
        updateCalendarHeader(); // カレンダーのヘッダーを更新
    });

    addTaskBtn.click(function () {
        const date = dateInput.val();
        const task = taskInput.val();
        if (date && task) {
            addTask(date, task); // タスクを追加
            saveTasksToLocalStorage(); // タスクをローカルストレージに保存
            dateInput.val("");
            taskInput.val("");
        }
    });

    clearAllBtn.click(function () {
        taskList.empty(); // タスクリストを空にする
        clearTasksFromLocalStorage(); // ローカルストレージからタスクを削除
    });

    function displayCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        calendar.empty(); // カレンダーを空にする

        let date = 1;
        for (let row = 0; row < 6; row++) {
            const newRow = $("<tr>");
            for (let col = 0; col < 7; col++) {
                if (row === 0 && col < firstDay) {
                    newRow.append($("<td>")); // 空のセルを追加
                } else if (date > lastDate) {
                    break;
                } else {
                    const newCell = $("<td>").text(date);
                    newCell.addClass("calendar-date");
                    newCell.attr("data-date", formatDate(currentDate, month, date));
                    newRow.append(newCell); // 日付のセルを追加
                    date++;
                }
            }
            calendar.append(newRow);
        }

        $(".calendar-date").click(function () {
            const selectedDate = $(this).attr("data-date");
            dateInput.val(selectedDate);
            updateTaskList(selectedDate); // タスクリストを更新
            $(".calendar-date").removeClass("calendar-date-selected"); // 選択された日付以外のハイライトを解除
            $(this).addClass("calendar-date-selected"); // 選択された日付をハイライト
        });
        updateTaskList("");
    }

    function updateCalendarHeader() {
        const options = { year: "numeric", month: "long" };
        currentMonth.text(currentDate.toLocaleDateString("ja-JP", options));
    }

    function formatDate(date, month, day) {
        const year = date.getFullYear();
        const formattedMonth = String(month + 1).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    function addTask(date, task) {
        const taskElement = $("<li>").text(date + ": " + task);
        const clearBtn = $("<button>").text("Clear");
        clearBtn.click(function () {
            taskElement.remove();
            saveTasksToLocalStorage(); // タスクをローカルストレージに保存
        });
        taskElement.append(clearBtn);
        taskList.append(taskElement); // タスクを追加

        $(".calendar-date-selected").removeClass("calendar-date-selected"); // 選択された日付のハイライトを解除
    }

    function updateTaskList() {
        taskList.children().show(); // 全てのタスクを表示
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.children().each(function () {
            const taskText = $(this).clone().children("button").remove().end().text().trim();
            tasks.push(taskText);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks)); // タスクをローカルストレージに保存
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(function (taskText) {
            const taskElement = $("<li>").text(taskText);
            const clearBtn = $("<button>").text("Clear");
            clearBtn.click(function () {
                taskElement.remove();
                saveTasksToLocalStorage(); // タスクをローカルストレージに保存
            });
            taskElement.append(clearBtn);
            taskList.append(taskElement); // タスクを追加
        });
    }

    function clearTasksFromLocalStorage() {
        localStorage.removeItem("tasks"); // ローカルストレージからタスクを削除
    }

    displayCalendar();
    updateCalendarHeader();
    loadTasksFromLocalStorage();
});

$(document).ready(function () {
    // 初期表示時の処理
    highlightSelectedDate();

    // 日付が変更された時の処理
    $('#date-input').on('change', function () {
        highlightSelectedDate();
    });
});


function highlightSelectedDate() {
    // 選択された日付を取得
    let selectedDate = $('#date-input').val();

    // カレンダーの日付セルをリセット
    $('#calendar-body td').removeClass('calendar-date-selected');

    // 選択された日付があれば、対応するセルをハイライト
    if (selectedDate) {
        $('#calendar-body td').filter(function () {
            return $(this).text() == new Date(selectedDate).getDate();
        }).addClass('calendar-date-selected');
    }
}

