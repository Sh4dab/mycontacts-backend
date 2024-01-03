const asyncHandler = require("express-async-handler");
const Contact= require("../models/contactModels");
// get all contacts
//access PRIVATE
const getAllContacts= asyncHandler(async(req,res)=>{
    const contacts= await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

// create contacts
//access PRIVATE
const createContacts= asyncHandler(async(req,res)=>{
    const {name,email,phoneno}=req.body;
    if(!name || !email || !phoneno){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact= await Contact.create({
        name,
        email,
        phoneno,
        user_id: req.user.id,
    })
    res.status(200).json(contact);
});

// get contact by id
//access PRIVATE
const getContactbyID= asyncHandler(async(req,res)=>{
    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found!"); 
    }
    res.status(200).json(contact);
});

// update contact
//access PRIVATE
const updateContact= asyncHandler(async(req,res)=>{
    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found!"); 
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }
    const updatedContact=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json(updatedContact);
});

//delete contact
//access PRIVATE
const deleteContact= asyncHandler(async(req,res)=>{
    const contact= await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("No Such Contact to delete");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User dont have permission to delete other user contacts");
    }
    await Contact.deleteOne({_id:req.params.id});
    res.status(200).json(contact);
});

module.exports = { getAllContacts, createContacts, getContactbyID, updateContact, deleteContact };