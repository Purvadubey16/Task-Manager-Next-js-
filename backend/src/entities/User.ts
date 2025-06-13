import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column() 
  email: string;

  @Column()
  password: string;


  
@Column("text", { nullable: true })
profileImageUrl: string | null;



  // Make nullable and explicitly typed as string | null
  @Column("text",{ nullable: true })
  resetToken: string | null;

//Make nullable and explicitly typed as Date | null
  @Column({ type: "timestamptz", nullable: true })
  resetTokenExpiry: Date | null;


   @Column({ type: "varchar", length: 15, nullable: true })
  phone: string | null;

  @Column({ type: "varchar", length: 15, nullable: true })
  lastname: string | null;

  @Column({ type: "date", nullable: true })
  dob: string | null;

  @Column({ type: "varchar", length: 10, nullable: true })
  gender: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  country: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  state: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  city: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  postalCode: string | null;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
