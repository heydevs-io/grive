import { User } from '@entities';
import { BusinessType, UserStatus } from '@enums';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class UserSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const businessTypes = [
      BusinessType.SERVICE,
      BusinessType.CONSTRUCTION,
      BusinessType.RETAIL,
      BusinessType.COSMETIC,
      BusinessType.OTHER,
    ];

    const userInsert: User[] = [];

    for (const type of businessTypes) {
      const user = userRepository.create({
        name: `User ${type}`,
        email: `testing_${type.toLowerCase()}@gmail.com`,
        status: UserStatus.ACTIVE,
      });
      userInsert.push(user);
    }

    await userRepository.save(userInsert);
  }
}
