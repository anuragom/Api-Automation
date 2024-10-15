export function generateOrderCode() {
    // Generate a random 10-digit number
    const randomCode = Math.floor(1000000000 + Math.random() * 9000000000);
    return randomCode.toString(); // Convert to string if necessary
}

// export function generatePincode(){
//     const randomCode = Math.floor(1000 + Math.random() * 9000);
//     return randomCode.toString(); // Convert to string if necessary
// }

export function generateContactName(){
    let result = ''; 
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 8; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
