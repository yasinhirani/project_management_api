class ApiResponse {
  data: any;
  success: boolean;
  message: string;
  constructor(data: any, message = "") {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
