/* eslint-disable prettier/prettier */
import { BaseEntity, Column, CreateDateColumn, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("template")
export class Template extends BaseEntity {
  @ObjectIdColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  generated_name: string;

  @Column()
  context: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;
}
