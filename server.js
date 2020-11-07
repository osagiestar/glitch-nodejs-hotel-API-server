const express = require("express");
const cors = require("cors");
var validator = require("email-validator");
const app = express();
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// function to create booking with all key:value pair
function checkBooking(newBooking) {
  console.log(newBooking);
  if (
    newBooking.id &&
    newBooking.title &&
    newBooking.firstName &&
    newBooking.surname &&
    newBooking.email &&
    newBooking.roomId &&
    newBooking.checkInDate &&
    newBooking.checkOutDate
  ) {
    return true;
  }
  return false;
}

// server adding id to the new booking entry 
function createId() {
  let lastId = bookings[bookings.length - 1].id;
  return lastId + 1;
}

// create a booking by calling checkBooking() and createId() functions
app.post("/bookings", function(req, res) {
  let newBooking = req.body;
  newBooking.id = createId();
  if (checkBooking(newBooking)) {
    bookings.push(newBooking);
    res.json(bookings);
  } else res.send({ status: 400 });
});

//get a booking by id
app.get("/bookings/:id", function(request,response){
  let {id} = request.params;
  let foundBooking = bookings.find(booking => id == booking.id);
  if(foundBooking)
  response.json(foundBooking);
  else
    response.send({status:404})
})

/// alternative - get a booking by id
// app.get("/bookings/:id", function (req, res) {
//  const {id} = req.params
//  const myBookings = bookings.find(e=> e.id == id);
//   let bookingsArr = myBookings;
//   // if(myBookings) 
//   myBookings? res.json(bookingsArr): res.send({status:404});
// });

// delete a booking by the id
app.delete("/bookings/:id", function (req, res) {
  const {id} = req.params;
 bookings = bookings.filter(e => e.id != id);
bookings? res.json(bookings): res.send({status:404});
});

// search by date
app.get("/search",function(request,response) {
  console.log("Hellooooooo")
 let searchDate = request.query.date;
 let foundBooking = bookings.find(booking => 
  booking.checkInDate == searchDate 
 || booking.checkOutDate == searchDate
 // || booking.firstName.toLowerCase().includes(searchDate.toLowerCase()) 
 // || booking.surname.toLowerCase().includes(searchDate.toLowerCase())
  )
 if(foundBooking) {
     response.json(foundBooking)
   }
 else{
     response.send({status:404})
   }
})

// search by text
app.get("/text", function(request,response){
 let searchQuery = request.query.term;
 let foundBooking = bookings.find(booking =>  booking.checkOutDate == searchQuery
  || booking.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  || booking.surname.toLowerCase().includes(searchQuery.toLowerCase()))
 if(foundBooking) {
     response.json(foundBooking)
   }
 else{
     response.send({status:404})
   }
})

// search and validate email 
app.get("/email",function(request,response){
 let searchEmail=request.query.email;
 let findEmail = bookings.filter(email => email.email.includes(searchEmail.toLowerCase()));
 if(validator.validate(searchEmail)) {
   response.json(findEmail)
 }else{
   response.send({status:400})
 }
})

// TODO add your routes and helper functions here
const listener = app.listen(process.env.PORT || 3002, function() {
  console.log("Your app is listening on port " + listener.address().port);
});