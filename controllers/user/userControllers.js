import { User } from "../../model/user/userModel.js";
import {Profile} from '../../model/profile/profileModel.js';
export const getUsers = async(req, res, next)=>{
    try {
        const users = await User.find();
        res.status(200).json({
            status:"success",
            count: users.length,
            data:{
                users
            }
        })
    }
    catch(err){
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }
}


export const createProfile = async (req, res, next) => {
    try {
        // // const { userId } = req.params; // Extract userId from req.params
        // console.log(req.user.id);
        const userId = req.user.id // extract  userId from middleware
        let { firstName, lastName, bio } = req.body; // Extract profile data from req.body

        
        // Create a new profile using the Profile model
        const profile = await Profile.create({
            user: userId, // Assign userId to the 'user' field in the Profile model
            firstName:firstName,
            lastName:lastName,
            bio
        });

        // Respond with success message and created profile data
        res.status(201).json({
            status: 'success',
            profileCreatedData: {
                profile
            }
        });
    } catch (err) {
        // Handle any errors that occur during profile creation
        res.status(500).json({
            status: 'failure',
            message: err.message
        });
    }
};


export const editProfille = async(req, res, next)=>{
    try{
        // console.log(req.user.id );
        const userId = req.user.id  // Extract profileId from req.params
        const {firstName, lastName, bio} = req.body     // Extract updated profile data from req.body
       // Update the profile with the provided profileId
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: userId },
            { firstName: firstName, lastName: lastName, bio: bio },
            { new: true, runValidators: true }
          );

          // If no profile is found, respond with a 404 status and failure message
        if(!updatedProfile){
            return res.status(404).json({
                status : "failure",
                message: "User profile is not found"
            })
        }
        // Respond with success message and updated profile data
        res.status(200).json({
            status:"success",
            updatedProfileData : {
                updatedProfile
            }
        })
    }catch(err){
        // Handle any errors that occur during profile update
        res.status(500).json({
            status:"failure",
            message:err.message
        })
    }
}

export const getProfile = async(req, res, next)=>{
    try{
        // console.log(req.user.id);
        const userId = req.user.id      // Extract profileId from req.params

        // Find the profile with the provided profileId
        // const profile = await Profile.findOne({_id:profileId})
        const profile = await Profile.find({user:userId})

        //// If no profile is found, respond with a 404 status and failure message
        if(!profile){
            return res.status(404).json({
                status:"failure",
                message : "Profile not Found"
            })
        }
        // Respond with success message and profile data
        res.status(200).json({
            status:"success",
            data :{
                profile
            }
        })
    }catch(err){
        res.status(500).json({
            status:"failure",
            message : err.message
        })
    }
}

export const deleteProfile = async(req, res, next) =>{
    try{
        const { profileId } = req.params;

        // Find the profile with the provided profileId and delete it
        const profile = await Profile.findByIdAndDelete(profileId);

        if (!profile) {
            return res.status(404).json({
                status: "failure",
                message: "Profile not found"
            });
        }

        // Respond with success message
        res.status(204).json({
            status: "success",
            message: "Profile deleted successfully"
        });


    }catch(err){
        res.status(500).json({
            status:"failure",
            message:err.message
        })
    }
}