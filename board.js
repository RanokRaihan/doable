const dataset = [
  {
    exam: "ssc",
    year: 2014,
    board: "jessore",
    roll: "108449",
    reg: "1113395924",
  },
  {
    exam: "ssc",
    year: 2014,
    board: "jessore",
    roll: "108450",
    reg: "1113395925",
  },
];

const getResult = (data) => {
  document.getElementById("exam").value = data.exam;
  document.getElementById("year").value = data.year;
  document.getElementById("board").value = data.board;
  document.getElementById("roll").value = data.roll;
  document.getElementById("reg").value = data.reg;
  let mathString = document
    .getElementById("value_s")
    .closest("tr")
    .querySelectorAll("td")[1]
    .innerText.trim();

  document.getElementById("value_s").value = eval(mathString);
  document.getElementById("button2").click();
};

dataset.forEach((data) => {
  getResult(data);
});
