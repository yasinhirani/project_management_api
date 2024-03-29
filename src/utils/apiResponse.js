class ApiResponse {
  constructor(data, message = "") {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
