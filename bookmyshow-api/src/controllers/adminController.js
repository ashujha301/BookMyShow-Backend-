const express = require("express");
const { Movie, Theatre, ShowTime } = require("../models/tablesModel");


// --------------------------------------------//create Showtime: showid,theatreid,movieid,date,showtime\\-----------------------------------------------------
//need to check this 
const createShow = async (req, res) => {
  try {
    const showtimeData = req.body;

    if (!Array.isArray(showtimeData) || showtimeData.length === 0) {
      return res
        .status(400)
        .json({ message: "Expected an array of showtime objects." });
    }

    const createdShowtimes = [];

    for (const showtime of showtimeData) {
      const { MovieID, TheatreID, Date, Time } = showtime;

      if (!MovieID || !TheatreID || !Date || !Time) {
        console.warn("Skipping invalid showtime:", showtime);
        continue;
      }

      // Check if any show with the same theatre, date, and time exists
      const existingShow = await ShowTime.findOne({
        where: {
          TheatreID,
          Date,
          Time,
        },
      });

      if (existingShow) {
        console.warn(
          "Showtime with the same theatre, date, and time already exists:",
          showtime
        );
        continue;
      }

      const newShowTime = await ShowTime.create(showtime);
      createdShowtimes.push(newShowTime);
    }

    res
      .status(201)
      .json({
        message: "Showtimes created successfully",
        showtimes: createdShowtimes,
      });
  } catch (error) {
    console.error("Error creating Showtimes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = { createShow };
