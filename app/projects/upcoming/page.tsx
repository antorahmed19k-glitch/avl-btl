
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/Sidebar';
import ProjectList from '@/components/ProjectList';
import { getSession } from '../../actions';
import { redirect } from 'next/navigation';

export default async function UpcomingPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const projects = await prisma.project.findMany({
    orderBy: { startDate: 'desc' }
  });

  const serializedProjects = projects.map(p => ({
    ...p,
    startDate: p.startDate.toISOString(),
    endDate: p.endDate.toISOString(),
    billSubmissionDate: p.billSubmissionDate?.toISOString() || '',
    sopRoiEmailSubmissionDate: p.sopRoiEmailSubmissionDate?.toISOString() || '',
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="flex min-h-screen">
      <Sidebar user={session} />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ProjectList 
            projects={serializedProjects as any} 
            type="upcoming" 
            currentUser={session} 
          />
        </div>
      </main>
    </div>
  );
}
