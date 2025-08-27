import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  role: string;
  active: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { profile, loading, isAdmin, isActive } = useUserProfile();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (profile && isAdmin && isActive) {
      fetchProfiles();
    }
  }, [profile, isAdmin, isActive]);

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data || []);
    }
    setLoadingProfiles(false);
  };

  const toggleUserActive = async (userId: string, currentActive: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ active: !currentActive })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive",
      });
      console.error('Error updating user status:', error);
    } else {
      toast({
        title: "Éxito",
        description: `Usuario ${!currentActive ? 'activado' : 'desactivado'} correctamente`,
      });
      fetchProfiles();
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario",
        variant: "destructive",
      });
      console.error('Error updating user role:', error);
    } else {
      toast({
        title: "Éxito",
        description: "Rol actualizado correctamente",
      });
      fetchProfiles();
    }
  };

  if (loading || loadingProfiles) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile || !isAdmin || !isActive) {
    return <Navigate to="/" replace />;
  }

  const totalUsers = profiles.length;
  const activeUsers = profiles.filter(p => p.active).length;
  const pendingUsers = profiles.filter(p => !p.active).length;
  const adminUsers = profiles.filter(p => p.role === 'admin').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard de Administración
          </h1>
          <p className="text-muted-foreground">
            Gestiona usuarios y permisos de acceso al sistema
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <UserX className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{adminUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Organización</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell>
                      {userProfile.first_name && userProfile.last_name
                        ? `${userProfile.first_name} ${userProfile.last_name}`
                        : 'Sin nombre'}
                    </TableCell>
                    <TableCell>
                      {userProfile.organization || 'No especificada'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                        {userProfile.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={userProfile.active ? 'default' : 'destructive'}>
                        {userProfile.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(userProfile.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={userProfile.active ? "destructive" : "default"}
                          onClick={() => toggleUserActive(userProfile.user_id, userProfile.active)}
                          disabled={userProfile.user_id === profile?.user_id}
                        >
                          {userProfile.active ? 'Desactivar' : 'Activar'}
                        </Button>
                        
                        {userProfile.role !== 'admin' && userProfile.user_id !== profile?.user_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserRole(userProfile.user_id, 'admin')}
                          >
                            Hacer Admin
                          </Button>
                        )}
                        
                        {userProfile.role === 'admin' && userProfile.user_id !== profile?.user_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserRole(userProfile.user_id, 'user')}
                          >
                            Quitar Admin
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;