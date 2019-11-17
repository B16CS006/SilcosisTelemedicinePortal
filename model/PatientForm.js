const mongoose = require('mongoose');

var PatientDetailsSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    place: {
        type: String
    },
    regNumber: {
        type: String
    },
    BOCW_ID_Number:{
        type:String
    },
    name:{
        type: String
    },
    aadharNumber:{
        type: String
    },
    dob:{
        type: Date
    },
    age:{
        type: Number
    },
    weight: {
        type: Number
    },
    sex: {
        type: String
    },
    address: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    presentOccupation: {
        type: Object
    },
    occupationHistory: {
        type: Object
    },
    historyOfSmoking: {
        type: String
    },
    chiefComplaints: {
        type: Object
    },
    duration_suffer: {
        type: String
    },
});

const PatientDetails = mongoose.model("PatientDetails", UserSchema)

module.exports = PatientDetails