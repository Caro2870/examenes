import { DataSource } from 'typeorm';
import { DatabaseConfig } from '../../config/database.config';
import { ConfigService } from '@nestjs/config';
import { Role, RoleType } from '../../entities/role.entity';
import { Plan, PlanType } from '../../entities/plan.entity';
import { Categoria } from '../../entities/categoria.entity';
import { Nivel, NivelType } from '../../entities/nivel.entity';
import { Dificultad, DificultadType } from '../../entities/dificultad.entity';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

async function runSeeds() {
  const configService = new ConfigService();
  const dbConfig = new DatabaseConfig(configService);
  const dataSource = new DataSource(dbConfig.createTypeOrmOptions());

  try {
    await dataSource.initialize();
    console.log('Database connected');

    // Seed Roles
    const roleRepository = dataSource.getRepository(Role);
    const roles = [
      { nombre: RoleType.SUPERADMIN, descripcion: 'Administrador del sistema' },
      { nombre: RoleType.SUSCRIPTOR, descripcion: 'Usuario premium' },
      { nombre: RoleType.FREE, descripcion: 'Usuario gratuito' },
    ];

    for (const roleData of roles) {
      const existingRole = await roleRepository.findOne({ where: { nombre: roleData.nombre } });
      if (!existingRole) {
        await roleRepository.save(roleRepository.create(roleData));
        console.log(`Role ${roleData.nombre} created`);
      }
    }

    // Seed Plans
    const planRepository = dataSource.getRepository(Plan);
    const plans = [
      {
        nombre: 'Plan Gratuito',
        tipo: PlanType.FREE,
        precio: 0,
        moneda: 'USD',
        descripcion: 'Acceso limitado a preguntas y exámenes',
        limite_examenes_diarios: 2,
        limite_preguntas_diarias: 50,
        acceso_completo: false,
      },
      {
        nombre: 'Plan Premium',
        tipo: PlanType.PREMIUM,
        precio: 9.99,
        moneda: 'USD',
        descripcion: 'Acceso completo ilimitado',
        limite_examenes_diarios: 0,
        limite_preguntas_diarias: 0,
        acceso_completo: true,
      },
    ];

    for (const planData of plans) {
      const existingPlan = await planRepository.findOne({ where: { tipo: planData.tipo } });
      if (!existingPlan) {
        await planRepository.save(planRepository.create(planData));
        console.log(`Plan ${planData.nombre} created`);
      }
    }

    // Seed Niveles
    const nivelRepository = dataSource.getRepository(Nivel);
    const niveles = [
      { nombre: NivelType.BASICO, descripcion: 'Nivel básico' },
      { nombre: NivelType.INTERMEDIO, descripcion: 'Nivel intermedio' },
      { nombre: NivelType.AVANZADO, descripcion: 'Nivel avanzado' },
    ];

    for (const nivelData of niveles) {
      const existingNivel = await nivelRepository.findOne({ where: { nombre: nivelData.nombre } });
      if (!existingNivel) {
        await nivelRepository.save(nivelRepository.create(nivelData));
        console.log(`Nivel ${nivelData.nombre} created`);
      }
    }

    // Seed Dificultades
    const dificultadRepository = dataSource.getRepository(Dificultad);
    const dificultades = [
      { nombre: DificultadType.FACIL, descripcion: 'Dificultad fácil' },
      { nombre: DificultadType.MEDIO, descripcion: 'Dificultad media' },
      { nombre: DificultadType.DIFICIL, descripcion: 'Dificultad difícil' },
    ];

    for (const dificultadData of dificultades) {
      const existingDificultad = await dificultadRepository.findOne({ where: { nombre: dificultadData.nombre } });
      if (!existingDificultad) {
        await dificultadRepository.save(dificultadRepository.create(dificultadData));
        console.log(`Dificultad ${dificultadData.nombre} created`);
      }
    }

    // Seed Categorías
    const categoriaRepository = dataSource.getRepository(Categoria);
    const categorias = [
      { nombre: 'AWS Cloud Practitioner', descripcion: 'Certificación AWS Cloud Practitioner', icono: 'aws' },
      { nombre: 'AWS Solutions Architect', descripcion: 'Certificación AWS Solutions Architect', icono: 'aws' },
      { nombre: 'AWS Developer', descripcion: 'Certificación AWS Developer', icono: 'aws' },
      { nombre: 'Azure Fundamentals', descripcion: 'Certificación Azure Fundamentals', icono: 'azure' },
      { nombre: 'Google Cloud', descripcion: 'Certificación Google Cloud', icono: 'gcp' },
    ];

    for (const categoriaData of categorias) {
      const existingCategoria = await categoriaRepository.findOne({ where: { nombre: categoriaData.nombre } });
      if (!existingCategoria) {
        await categoriaRepository.save(categoriaRepository.create(categoriaData));
        console.log(`Categoría ${categoriaData.nombre} created`);
      }
    }

    // Seed Superadmin User
    const userRepository = dataSource.getRepository(User);
    const superadminRole = await roleRepository.findOne({ where: { nombre: RoleType.SUPERADMIN } });
    const freePlan = await planRepository.findOne({ where: { tipo: PlanType.FREE } });

    const existingAdmin = await userRepository.findOne({ where: { email: 'admin@examenes.com' } });
    if (!existingAdmin && superadminRole && freePlan) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = userRepository.create({
        email: 'admin@examenes.com',
        password: hashedPassword,
        nombre: 'Admin',
        apellido: 'Sistema',
        role_id: superadminRole.id,
        plan_id: freePlan.id,
        activo: true,
        ultimo_reseteo: new Date(),
      });
      await userRepository.save(admin);
      console.log('Superadmin user created (admin@examenes.com / admin123)');
    }

    console.log('Seeds completed successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('Error running seeds:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeeds();

