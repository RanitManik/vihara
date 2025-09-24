export type HotelType = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    address: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    imageUrls: string[];
    starRating: number;
    lastUpdated: Date;
    bookings: BookingType[];
};

export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
        totalHotels: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
};

export type PaymentIntentResponse = {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
};

export type BookingType = {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    adultCount: number;
    childCount: number;
    checkIn: Date;
    checkOut: Date;
    totalCost: number;
};
