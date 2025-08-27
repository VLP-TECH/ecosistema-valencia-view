import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface UserProfile {
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkUserRole();
      fetchUsers();
    }
  }, [user]);

  const checkUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setUserRole(data.role);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserProfiles(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      setUserProfiles(prev => 
        prev.map(user => 
          user.user_id === userId 
            ? { ...user, active: !currentStatus }
            : user
        )
      );

      toast({
        title: "Estado actualizado",
        description: `Usuario ${!currentStatus ? 'activado' : 'desactivado'} correctamente`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario",
        variant: "destructive",
      });
    }
  };

  const changeUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      setUserProfiles(prev => 
        prev.map(user => 
          user.user_id === userId 
            ? { ...user, role: newRole }
            : user
        )
      );

      toast({
        title: "Rol actualizado",
        description: `Usuario ahora es ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario",
        variant: "destructive",
      });
    }
  };

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const stats = {
    total: userProfiles.length,
    active: userProfiles.filter(u => u.active).length,
    pending: userProfiles.filter(u => !u.active).length,
    admins: userProfiles.filter(u => u.role === 'admin').length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Gestiona usuarios y permisos del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Organización</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {profile.first_name} {profile.last_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {profile.organization || 'No especificada'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                        {profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.active ? 'default' : 'destructive'}>
                        {profile.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={profile.active ? "destructive" : "default"}
                          onClick={() => toggleUserStatus(profile.user_id, profile.active)}
                        >
                          {profile.active ? 'Desactivar' : 'Activar'}
                        </Button>
                        {profile.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeUserRole(profile.user_id, 'admin')}
                          >
                            Hacer Admin
                          </Button>
                        )}
                        {profile.role === 'admin' && profile.user_id !== user?.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => changeUserRole(profile.user_id, 'user')}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;