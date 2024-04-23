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
  // Show loading animation
  document.getElementById("loading").style.display = "block";


  try {
    // const selectedStartDate =
    //   document.getElementById("startDateDropdown").value;
    // const selectedEndDate = document.getElementById("endDateDropdown").value;
    // // Use the selected values as needed
    // console.log("Selected start date:", selectedStartDate);
    // console.log("Selected end date:", selectedEndDate);



    const year = 2024;
    const month = parseInt(document.getElementById("inputMonth").value);
    const weekendDates = getWeekendDates(year, month);
    console.log(weekendDates)
    // populateDropdown(weekendDates);

    const friArray = [];
    const sunArray = [];
    const flightData = [];

    weekendDates.forEach((value, index) => {
      if (index % 2 === 0) {
        friArray.push(value);
      }
  });
  
  // Loop through odd indices and assign values to oddArray
  weekendDates.forEach((value, index) => {
      if (index % 2 !== 0) {
        sunArray.push(value);
      }
  });

 const promises = friArray.map((friDate, index) => {
 const sunDate = sunArray[index];
    const requestData = {
      trip: 2,
      dep_location_codes: "TPE",
      arr_location_codes: "TYO",
      dep_location_types: 2,
      arr_location_types: 2,
      dep_dates: friDate,
      return_date: sunDate,
      adult: 1,
      child: 0,
      cabin_class: 2,
      is_direct_flight_only: true,
      exclude_budget_airline: false,
      search_key: "26f232d3205cebfde9db515b67b88b15f21aa1b6",
      target_page: 1,
      order_by: "0_1",
    };

    // const requestDataRound = {
    //   depa: "TPE",
    //   dest: "OKA",
    //   OUT_DATE: friArray[i],
    //   IN_DATE: sunArray[i],
    //   adults: 1,
    // };

    return fetch("/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    }).then(response => response.json());})
  
    const responseData = await Promise.all(promises);
    
    // Hide loading animation after all API calls are finished
    document.getElementById("loading").style.display = "none";
  
    console.log("responseData: ", responseData)

  
     // Display the accumulated flight data
     displayResult(responseData, friArray, sunArray);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Hide loading animation in case of error
    document.getElementById("loading").style.display = "none";
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
      // inputResult(data);
      console.log("Server response:", data);
    } catch (error) {
      console.error("Error sending data:", error);
    }

    
    // console.log(`Weekend Dates for ${month} 2024:`);
  });

  function displayResult(data, friArray, sunArray) {
    const resultContainer = document.getElementById("resultContainer");
    let tableHtml = `<table><tr><th style="border: 1px solid black;padding: 10px;">Dates</th><th style="border: 1px solid black;padding: 10px;">Airline</th><th style="border: 1px solid black;padding: 10px;">Price</th></tr>`;
  
    // Iterate over each object in the data array
    data.forEach((item, index) => {
      // Access the carrier_options array in each object
      const carrierOptions = item.carrier_options;
  
      // Find the option with the smallest minPrice
      const cheapestOption = carrierOptions.reduce((prev, current) => {
        return prev.minPrice < current.minPrice ? prev : current;
      });
      // Format the minPrice in NTD
    const formattedPrice = cheapestOption.minPrice.toLocaleString("zh-TW", {
      style: "currency",
      currency: "TWD",
    });
  
      // Add a row to the table for the cheapest option
      tableHtml += `<tr><td style='border: 1px solid black; padding: 10px;'>${friArray[index]} ~ ${sunArray[index]}</td><td style='border: 1px solid black; padding: 10px;'>${cheapestOption.carrierName}</td><td style='border: 1px solid black;padding: 10px'>${formattedPrice}</td></tr>`;
    });
  
    tableHtml += "</table>";
    resultContainer.innerHTML = tableHtml;
  }
  

function inputResult(data) {
  const resultContainer = document.getElementById("inputResult");
  // resultContainer.textContent = JSON.stringify(data);
  resultContainer.textContent = data;
}

// function getWeekendDates(year, month) {
//   const dates = [];
//   const firstDay = new Date(year, month - 1, 1);
//   const lastDay = new Date(year, month, 0);

//   for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
//     const dayOfWeek = d.getDay();
//     if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
//       const formattedDate = `${d.getFullYear()}-${String(
//         d.getMonth() + 1
//       ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//       dates.push(formattedDate);
//     }
//   }

//   return dates;
// }

function getWeekendDates(year, month) {
  const dates = [];
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const lastDayOfWeek = lastDay.getDay();

  // Loop through each day of the month
  for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();

      // Check if it's a Friday, Saturday, or Sunday
      if (dayOfWeek === 5 ||dayOfWeek === 0) {
          const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          // const formattedDate = `${String(d.getDate()).padStart(2, "0")}%2F${String(d.getMonth() + 1).padStart(2, "0")}%2F${d.getFullYear()}`;
          dates.push(formattedDate);
      }
  }

  // Check if the number of weekend dates is not divisible by 3
  if (dates.length % 2 !== 0) {
      // Get the first two days of the following month
      const nextMonthFirstDay = new Date(year, month, 1);
      const nextMonthSecondDay = new Date(year, month, 2);
      const nextMonthFirstDayOfWeek = nextMonthFirstDay.getDay();
      const nextMonthSecondDayOfWeek = nextMonthSecondDay.getDay();

      // If the first two days of the following month are Saturday or Sunday, add them to the list
      if ( nextMonthFirstDayOfWeek === 0) {
          dates.push(`${nextMonthFirstDay.getFullYear()}-${String(nextMonthFirstDay.getMonth() + 1).padStart(2, "0")}-${String(nextMonthFirstDay.getDate()).padStart(2, "0")}`);
          // dates.push(`${String(nextMonthFirstDay.getDate()).padStart(2, "0")}%2F${String(nextMonthFirstDay.getMonth() + 1).padStart(2, "0")}%2F${nextMonthFirstDay.getFullYear()}`);
      }
      if ( nextMonthSecondDayOfWeek === 0) {
        dates.push(`${nextMonthSecondDay.getFullYear()}-${String(nextMonthSecondDay.getMonth() + 1).padStart(2, "0")}-${String(nextMonthSecondDay.getDate()).padStart(2, "0")}`);
          // dates.push(`${String(nextMonthSecondDay.getDate()).padStart(2, "0")}%2F${String(nextMonthSecondDay.getMonth() + 1).padStart(2, "0")}%2F${nextMonthSecondDay.getFullYear()}`);
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