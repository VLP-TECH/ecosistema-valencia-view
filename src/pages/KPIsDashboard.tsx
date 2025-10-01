import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import NavigationHeader from "@/components/NavigationHeader";
import FooterSection from "@/components/FooterSection";
import { AlertCircle, TrendingUp } from "lucide-react";

interface KPI {
  dimension: string;
  subdimension: string;
  indicator: string;
  status: string;
  description: string;
  formula: string;
  data: string;
  source: string;
  importance: string;
  frequency: string;
  sourceDetail: string;
  bibliography: string;
}

const KPIsDashboard = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState<string[]>([]);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      const response = await fetch('/data/kpis-completo.csv');
      const text = await response.text();
      const lines = text.split('\n');
      
      const parsedKPIs: KPI[] = [];
      const uniqueDimensions = new Set<string>();

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(';');
        if (values.length >= 13) {
          const kpi: KPI = {
            dimension: values[0]?.trim() || '',
            subdimension: values[1]?.trim() || '',
            indicator: values[2]?.trim() || '',
            status: values[3]?.trim() || '',
            description: values[5]?.trim() || '',
            formula: values[6]?.trim() || '',
            data: values[7]?.trim() || '',
            source: values[8]?.trim() || '',
            importance: values[9]?.trim() || '',
            frequency: values[10]?.trim() || '',
            sourceDetail: values[11]?.trim() || '',
            bibliography: values[12]?.trim() || ''
          };

          if (kpi.dimension) {
            parsedKPIs.push(kpi);
            uniqueDimensions.add(kpi.dimension);
          }
        }
      }

      setKpis(parsedKPIs);
      setDimensions(Array.from(uniqueDimensions));
      setLoading(false);
    } catch (error) {
      console.error('Error loading KPIs:', error);
      setLoading(false);
    }
  };

  const getKPIsByDimension = (dimension: string) => {
    return kpis.filter(kpi => kpi.dimension === dimension);
  };

  const getImportanceColor = (importance: string) => {
    const imp = importance.toLowerCase();
    if (imp.includes('alta') || imp.includes('high')) return "bg-destructive/10 text-destructive";
    if (imp.includes('media') || imp.includes('medium')) return "bg-warning/10 text-warning";
    return "bg-success/10 text-success";
  };

  const getStatusColor = (status: string) => {
    if (status.toLowerCase() === 'ok') return "bg-success/10 text-success";
    return "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Cargando KPIs...</p>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Dashboard Completo de KPIs
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Sistema de indicadores del ecosistema digital valenciano organizados por dimensiones
            </p>
          </div>

          {/* Tabs por dimensión */}
          <Tabs defaultValue={dimensions[0]} className="w-full">
            <TabsList className="w-full justify-start flex-wrap h-auto mb-8 bg-muted/50 p-2">
              {dimensions.map((dimension) => (
                <TabsTrigger 
                  key={dimension} 
                  value={dimension}
                  className="text-sm px-4 py-2"
                >
                  {dimension}
                </TabsTrigger>
              ))}
            </TabsList>

            {dimensions.map((dimension) => (
              <TabsContent key={dimension} value={dimension} className="space-y-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{dimension}</h2>
                  <p className="text-muted-foreground">
                    Total de indicadores: {getKPIsByDimension(dimension).length}
                  </p>
                </div>

                <div className="grid gap-6">
                  {getKPIsByDimension(dimension).map((kpi, index) => (
                    <Card key={index} className="p-6 hover:shadow-medium transition-all border-l-4 border-l-primary">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {kpi.status && (
                                <Badge className={getStatusColor(kpi.status)}>
                                  {kpi.status}
                                </Badge>
                              )}
                              {kpi.importance && (
                                <Badge className={getImportanceColor(kpi.importance)}>
                                  {kpi.importance}
                                </Badge>
                              )}
                              {kpi.frequency && (
                                <Badge variant="outline" className="text-xs">
                                  {kpi.frequency}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-1">
                              {kpi.indicator}
                            </h3>
                            {kpi.subdimension && (
                              <p className="text-sm text-muted-foreground">
                                Subdimensión: {kpi.subdimension}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Descripción */}
                        {kpi.description && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              Descripción
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {kpi.description}
                            </p>
                          </div>
                        )}

                        {/* Fórmula */}
                        {kpi.formula && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              Fórmula de cálculo
                            </h4>
                            <p className="text-sm text-muted-foreground font-mono bg-muted/30 p-2 rounded">
                              {kpi.formula}
                            </p>
                          </div>
                        )}

                        {/* Datos */}
                        {kpi.data && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">
                              Datos
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {kpi.data}
                            </p>
                          </div>
                        )}

                        {/* Footer con fuentes */}
                        <div className="pt-4 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
                          {kpi.source && (
                            <div>
                              <span className="font-medium">Origen: </span>
                              {kpi.source}
                            </div>
                          )}
                          {kpi.sourceDetail && (
                            <div>
                              <span className="font-medium">Fuente: </span>
                              {kpi.sourceDetail}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default KPIsDashboard;
