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
