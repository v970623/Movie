export interface SearchParams {
  keyword?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Application {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  title: string;
  content: string;
  status: string;
  createdAt: string;
  attachments?: {
    fileUrl?: string;
    fileName?: string;
  }[];
}

export interface DecodedToken {
  id: string;
  role: "staff" | "public";
}
