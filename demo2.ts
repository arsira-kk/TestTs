interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: {
        color: string;
        type: string;
    };
    domain: string;
    ip: string;
    address: {
        address: string;
        city: string;
        coordinates: {
            lat: number;
            lng: number;
        };
        postalCode: string;
        state: string;
    };
    macAddress: string;
    university: string;
    bank: {
        cardExpire: string;
        cardNumber: string;
        cardType: string;
        currency: string;
        iban: string;
    };
    company: {
        address: {
            address: string;
            city: string;
            coordinates: {
                lat: number;
                lng: number;
            };
            postalCode: string;
            state: string;
        };
        department: string;
        name: string;
        title: string;
    };
    ein: string;
    ssn: string;
    userAgent: string;
}

interface UsersResponse {
    users: User[];
}



interface DepartmentDetails {
    male: number;
    female: number;
    ageRange: string;
    hair: Record<string, number>;
    addressUser: Record<string, string>;
}

interface DepartmentGroups {
    [department: string]: DepartmentDetails;
}

async function fetchUsers(): Promise<User[]> {
    const response = await fetch('https://dummyjson.com/users');
    const data: UsersResponse = await response.json();
    return data.users;
}

function calculateAgeRange(users: User[]): string {
    if (users.length === 0) return '0-0';
    const ages = users.map(user => user.age);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    return `${minAge}-${maxAge}`;
}

function groupAndSummarizeUsersByDepartment(users: User[]): DepartmentGroups {
    return users.reduce((groups, user) => {
        const department = user.company.department;
        const gender = user.gender.toLowerCase();
        const hairColor = user.hair.color;
        const fullName = `${user.firstName}${user.lastName}`;

        if (!groups[department]) {
            groups[department] = {
                male: 0,
                female: 0,
                ageRange: '0-0',
                hair: {},
                addressUser: {}
            };
        }

        if (gender === 'male') {
            groups[department].male += 1;
        } else if (gender === 'female') {
            groups[department].female += 1;
        }

        if (!groups[department].hair[hairColor]) {
            groups[department].hair[hairColor] = 0;
        }
        groups[department].hair[hairColor] += 1;

        groups[department].addressUser[fullName] = user.address.postalCode;

        return groups;
    }, {} as DepartmentGroups);
}

async function main() {
    try {
        const users = await fetchUsers();
        const groupedUsers = groupAndSummarizeUsersByDepartment(users);

     
        for (const department in groupedUsers) {
            const departmentUsers = users.filter(user => user.company.department === department);
            groupedUsers[department].ageRange = calculateAgeRange(departmentUsers);
        }

        console.log(groupedUsers);
    } catch (error) {
        console.error('Error fetching or processing users:', error);
    }
}

main();
