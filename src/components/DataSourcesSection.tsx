import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Globe, 
  BarChart3, 
  Zap, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react";

const DataSourcesSection = () => {
  const dataSources = [
    {
      name: "Instituto Nacional de Estadística (INE)",
      type: "Oficial",
      status: "active",
      lastUpdate: "2024-01-15",
      frequency: "Mensual",
      indicators: ["Empresas TIC", "Empleo Digital", "Facturación"],
      icon: BarChart3,
      color: "bg-primary/10 text-primary"
    },
    {
      name: "Eurostat - Digital Economy",
      type: "Europeo",
      status: "active",
      lastUpdate: "2024-01-10",
      frequency: "Trimestral",
      indicators: ["DESI Index", "E-commerce", "Digital Skills"],
      icon: Globe,
      color: "bg-accent/10 text-accent"
    },
    {
      name: "Red.es - Banda Ancha",
      type: "Gubernamental",
      status: "active",
      lastUpdate: "2024-01-12",
      frequency: "Mensual",
      indicators: ["Cobertura Fibra", "Velocidades", "Penetración"],
      icon: Zap,
      color: "bg-success/10 text-success"
    },
    {
      name: "Portal de Datos Abiertos GVA",
      type: "Autonómico",
      status: "maintenance",
      lastUpdate: "2024-01-05",
      frequency: "Semanal",
      indicators: ["Startups", "Inversión", "Innovación"],
      icon: Database,
      color: "bg-secondary/10 text-secondary"
    }
  ];

  const integrationMethods = [
    {
      title: "APIs REST",
      description: "Integración directa con servicios oficiales",
      technologies: ["OAuth 2.0", "JWT", "Rate Limiting"],
      status: "Implementado"
    },
    {
      title: "Web Scraping",
      description: "Extracción automatizada de datos públicos",
      technologies: ["Selenium", "Puppeteer", "Scrapy"],
      status: "En desarrollo"
    },
    {
      title: "ETL Pipelines",
      description: "Procesamiento y normalización de datos",
      technologies: ["Apache Airflow", "Pandas", "SQL"],
      status: "Implementado"
    },
    {
      title: "Real-time Streaming",
      description: "Datos en tiempo real y alertas",
      technologies: ["Apache Kafka", "WebSockets", "Redis"],
      status: "Planificado"
    }
  ];

  return (
    <section id="data" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Fuentes de Datos e Integración
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Infraestructura técnica para la captura, procesamiento y almacenamiento automatizado 
            de datos del ecosistema digital valenciano
          </p>
        </div>

        {/* Data Sources */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 flex items-center">
            <Database className="h-6 w-6 mr-3 text-primary" />
            Fuentes de Datos Conectadas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataSources.map((source) => (
              <Card key={source.name} className="p-6 hover:shadow-medium transition-all duration-300 bg-gradient-card border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${source.color}`}>
                    <source.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {source.status === 'active' ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-warning" />
                    )}
                    <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                      {source.status === 'active' ? 'Activo' : 'Mantenimiento'}
                    </Badge>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-foreground mb-2">{source.name}</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Tipo: {source.type} • Frecuencia: {source.frequency}
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Indicadores:</p>
                    <div className="flex flex-wrap gap-2">
                      {source.indicators.map((indicator) => (
                        <Badge key={indicator} variant="outline" className="text-xs">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      Última actualización: {new Date(source.lastUpdate).toLocaleDateString('es-ES')}
                    </span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Methods */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-foreground mb-8 flex items-center">
            <RefreshCw className="h-6 w-6 mr-3 text-accent" />
            Métodos de Integración
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationMethods.map((method) => (
              <Card key={method.title} className="p-6 text-center hover:shadow-medium transition-all duration-300 bg-gradient-card border-0">
                <h4 className="text-lg font-semibold text-foreground mb-3">{method.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">Tecnologías:</p>
                    <div className="space-y-1">
                      {method.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs block">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Badge 
                    variant={method.status === 'Implementado' ? 'default' : 
                            method.status === 'En desarrollo' ? 'secondary' : 'outline'}
                    className="mt-3"
                  >
                    {method.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Architecture */}
        <Card className="p-8 bg-gradient-card border-0">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Arquitectura Técnica de Datos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">Captura</h4>
              <p className="text-muted-foreground text-sm">
                APIs, Web Scraping, ETL automático desde fuentes oficiales
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <RefreshCw className="h-8 w-8 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">Procesamiento</h4>
              <p className="text-muted-foreground text-sm">
                Normalización, validación y enriquecimiento de datos
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-success" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">Visualización</h4>
              <p className="text-muted-foreground text-sm">
                Dashboards interactivos y informes automatizados
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default DataSourcesSection;