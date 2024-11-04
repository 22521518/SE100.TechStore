export const generateDummyCustomerData = (id) => {
    const randomUsername = () => `user_${Math.random().toString(36).substr(2, 7)}`;
    const randomFullName = () => {
      const firstNames = ["John", "Jane", "Alex", "Taylor", "Chris", "Morgan"];
      const lastNames = ["Doe", "Smith", "Brown", "Johnson", "Lee", "Taylor"];
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    };
    const randomGender = () => Math.floor(Math.random()*2)>1?'MALE':'FEMALE'
    const randomPhoneNumber = () => `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
    const randomEmail = () => `${randomUsername()}@example.com`;
  
    return {
      customer_id: id || `customer-${Math.floor(Math.random() * 100000)}`,
      username: randomUsername(),
      full_name: randomFullName(),
      gender: randomGender(),
      phone_number: randomPhoneNumber(),
      birth_date: new Date(new Date().getTime() - Math.floor(Math.random() * 3.154e+10)).toISOString(), // Random date within the last year
      date_joined: new Date(new Date().getTime() - Math.floor(Math.random() * 3.154e+10)).toISOString(), // Random date within the last year
      account: {
        email: randomEmail(),
      },
    };
  };
  