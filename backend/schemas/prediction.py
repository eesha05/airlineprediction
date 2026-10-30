from pydantic import BaseModel, Field
from typing import Optional, Literal

class PassengerPredictionInput(BaseModel):
    Gender: Literal["Male", "Female"]
    Customer_Type: Literal["Loyal Customer", "disloyal Customer"] = Field(alias="Customer Type")
    Age: int = Field(ge=0, le=120)
    Type_of_Travel: Literal["Business travel", "Personal Travel"] = Field(alias="Type of Travel")
    Class: Literal["Business", "Eco", "Eco Plus"]
    Flight_Distance: int = Field(ge=0, le=20000, alias="Flight Distance")
    Inflight_wifi_service: int = Field(ge=0, le=5, alias="Inflight wifi service")
    Departure_Arrival_time_convenient: int = Field(ge=0, le=5, alias="Departure/Arrival time convenient")
    Ease_of_Online_booking: int = Field(ge=0, le=5, alias="Ease of Online booking")
    Gate_location: int = Field(ge=0, le=5, alias="Gate location")
    Food_and_drink: int = Field(ge=0, le=5, alias="Food and drink")
    Online_boarding: int = Field(ge=0, le=5, alias="Online boarding")
    Seat_comfort: int = Field(ge=0, le=5, alias="Seat comfort")
    Inflight_entertainment: int = Field(ge=0, le=5, alias="Inflight entertainment")
    On_board_service: int = Field(ge=0, le=5, alias="On-board service")
    Leg_room_service: int = Field(ge=0, le=5, alias="Leg room service")
    Baggage_handling: int = Field(ge=1, le=5, alias="Baggage handling")
    Checkin_service: int = Field(ge=0, le=5, alias="Checkin service")
    Inflight_service: int = Field(ge=0, le=5, alias="Inflight service")
    Cleanliness: int = Field(ge=0, le=5, alias="Cleanliness")
    Departure_Delay_in_Minutes: int = Field(ge=0, alias="Departure Delay in Minutes")
    Arrival_Delay_in_Minutes: float = Field(ge=0.0, alias="Arrival Delay in Minutes")

    class Config:
        populate_by_name = True

class PassengerPredictionOutput(BaseModel):
    prediction: str
    satisfied_probability: float
    neutral_dissatisfied_probability: float
