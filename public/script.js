document.getElementById("fetchDataBtn").addEventListener("click", fetchData);

// async function fetchData() {
//   try {
//     const response = await fetch("http://localhost:3000/flights");
//     const data = await response.json();
//     console.log(data.carrier_options);
//     displayResult(data);
//     const year = 2024;
//     const month = parseInt(document.getElementById("inputResult").textContent);
//     const weekendDates = getWeekendDates(year, month);

//     console.log(`Weekend Dates for ${month} 2024:`);
//     weekendDates.forEach((date) => console.log(date));
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }
async function fetchData() {
  try {
    const selectedStartDate =
      document.getElementById("startDateDropdown").value;
    const selectedEndDate = document.getElementById("endDateDropdown").value;

    // Use the selected values as needed
    console.log("Selected start date:", selectedStartDate);
    console.log("Selected end date:", selectedEndDate);

    const requestData = {
      trip: 2,
      dep_location_codes: "TPE",
      arr_location_codes: "TYO",
      dep_location_types: 2,
      arr_location_types: 2,
      dep_dates: selectedStartDate,
      return_date: selectedEndDate,
      adult: 1,
      child: 0,
      cabin_class: 2,
      is_direct_flight_only: false,
      exclude_budget_airline: false,
      search_key: "26f232d3205cebfde9db515b67b88b15f21aa1b6",
      target_page: 1,
      order_by: "0_1",
    };
    const response = await fetch("/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    displayResult(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document
  .getElementById("inputMonth")
  .addEventListener("change", async function (event) {
    const requestData = {
      month: this.value,
    };
    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      inputResult(data);
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error sending data:", error);
    }

    const year = 2024;
    const month = parseInt(document.getElementById("inputMonth").value);
    const weekendDates = getWeekendDates(year, month);
    populateDropdown(weekendDates);

    console.log(`Weekend Dates for ${month} 2024:`);
  });

function displayResult(data) {
  const resultContainer = document.getElementById("resultContainer");
  let carrierOptions = data.carrier_options;
  let factText = "";

  carrierOptions.forEach((option) => {
    factText += option.carrierName + ": $" + option.minPrice + "\n";
  });
  resultContainer.innerText = factText;
}

function inputResult(data) {
  const resultContainer = document.getElementById("inputResult");
  // resultContainer.textContent = JSON.stringify(data);
  resultContainer.textContent = data;
}

function getWeekendDates(year, month) {
  const dates = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
      const formattedDate = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dates.push(formattedDate);
    }
  }

  return dates;
}

function populateDropdown(weekendDates) {
  const startDropdown = document.getElementById("startDateDropdown");
  const endDropdown = document.getElementById("endDateDropdown");

  // Clear existing options
  startDropdown.innerHTML = "";
  endDropdown.innerHTML = "";

  weekendDates.forEach((date) => {
    const option = document.createElement("option");
    option.textContent = date;
    option.value = date;
    startDropdown.appendChild(option);
  });

  weekendDates.forEach((date) => {
    const option = document.createElement("option");
    option.textContent = date;
    option.value = date;
    endDropdown.appendChild(option);
  });
}
