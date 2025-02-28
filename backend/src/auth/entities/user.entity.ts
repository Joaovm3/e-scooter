// import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { Exclude } from 'class-transformer';
// import * as bcrypt from 'bcrypt';

// @Entity('users')
// export class User {
// @PrimaryGeneratedColumn('uuid')
// id: string;

// @Column({ unique: true })
// email: string;

// @Column()
// username: string;

// @Column()
// @Exclude()
// password: string;

// @Column({ default: false })
// isAdmin: boolean;

// @CreateDateColumn()
// createdAt: Date;

// @UpdateDateColumn()
// updatedAt: Date;

// @BeforeInsert()
// async hashPassword() {
//     this.password = await bcrypt.hash(this.password, 10);
// }

// async validatePassword(password: string): Promise<boolean> {
//     return bcrypt.compare(password, this.password);
// }
// }
