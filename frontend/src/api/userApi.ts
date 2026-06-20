export interface UserResponse {
  UserId: number;
  FirstName: string;
  LastName: string;
}

export async function getUsers(): Promise<UserResponse[]> {
  const res = await fetch("http://localhost:8080/users");

  if (!res.ok) {
    throw new Error("Ошибка загрузки пользователей");
  }

  return res.json();
}