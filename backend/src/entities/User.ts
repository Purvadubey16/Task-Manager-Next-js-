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


  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
