import { Document } from "mongoose";
import { HTTP } from "./enums";

export interface iError {
  name: string;
  message: string;
  status: HTTP;
  success: boolean;
}

interface iUser {
  userName: string;
  firstName: string;
  lastName: string;
  isVerify: boolean;
  verifyToken: string;
  userCode: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  location: string;

  friends: [];
  followers: [];
  followings: [];

  wordsAdded: Array<{}>;
}

export interface iUserData extends iUser, Document {}

interface iProperty {
  userID: string;
  category: string;
  propertyName: string;
  propertyCaptureTitle: string;
  mainDescription: string;
  firstDescription: string;
  gallaryDescription: string;
  closingDescription: string;
  closingTitle: string;
  bathroom: string;
  bedroom: string;
  startingPrice: string;
  city: string;
  country: string;
  location: string;
  gallaryImages: Array<string>;
  coverImage: string;
  map: string;
  brochure: string;
  measure: string;
  region: string;
  community: string;

  user: {};
  client: [];
}

export interface iPropertyData extends iProperty, Document {}

interface iClient {
  agentID: string;
  firstName: string;
  lastName: string;
  email: string;
  propertyName: string;
  propertyID: string;
  phoneNumber: string;
  preferredPhoneContact: boolean;
  preferredEmailContact: boolean;

  user: {};
  property: {};
}

export interface iClientData extends iClient, Document {}

interface iWord {
  word: string;
  audio: string;
  audioID: string;

  meaning: Array<{}>;
  postedBy: string;
}

export interface iWordData extends iWord, Document {}

interface iMeaning {
  defined: string;
  useCase: Array<string>;
  definedBy: string;
  agreed: Array<string>;
}

export interface iMeaningData extends iMeaning, Document {}
