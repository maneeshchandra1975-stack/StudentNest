import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function FeaturedListings({ housingLoading, topHousing, marketplaceLoading, topMarketplace }) {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-24">
        
        {/* Housing Section */}
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground font-heading tracking-tight">
                Featured Housing
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl text-lg">
                Recent verified accommodations and room vacancies.
              </p>
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={() => navigate('/roommates')}
              className="w-full sm:w-auto rounded-full bg-background"
            >
              Explore Housing <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {housingLoading ? (
            <div className="text-sm text-muted-foreground py-12 text-center">Loading campus listings...</div>
          ) : topHousing.length === 0 ? (
            <div className="text-sm text-muted-foreground py-12 text-center border border-dashed border-border rounded-xl">No housing listings found. Be the first to post!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topHousing.map((post, idx) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="p-6 flex flex-col justify-between space-y-4 border-border/50 h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer" onClick={() => navigate('/roommates')}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {post.roomType}
                          </Badge>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            {post.vacancy} Vacancy
                          </Badge>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground font-heading leading-snug line-clamp-1 group-hover:text-primary transition-colors">{post.title}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="line-clamp-1">{post.location}</span>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-border flex justify-between items-center">
                      <div>
                        <div className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Rent Share</div>
                        <div className="text-xl font-black text-foreground">
                          ₹{post.rentShare?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ mo</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Marketplace Section */}
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground font-heading tracking-tight">
                Campus Marketplace
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl text-lg">
                Textbooks, electronics, and essentials passed down directly between batches.
              </p>
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={() => navigate('/marketplace')}
              className="w-full sm:w-auto rounded-full bg-background"
            >
              Browse Marketplace <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {marketplaceLoading ? (
            <div className="text-sm text-muted-foreground py-12 text-center">Loading marketplace items...</div>
          ) : topMarketplace.length === 0 ? (
            <div className="text-sm text-muted-foreground py-12 text-center border border-dashed border-border rounded-xl">No marketplace items listed yet. Be the first to post!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMarketplace.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer border-border/50" onClick={() => navigate('/marketplace')}>
                    <div>
                      <div className="relative h-56 w-full overflow-hidden bg-muted">
                        <img
                          src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-foreground border border-border/50 shadow-sm uppercase tracking-wider">
                          {item.condition}
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="text-lg font-bold text-foreground line-clamp-1 font-heading group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          Seller: <span className="font-semibold text-foreground">{item.seller?.name || 'Student'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between mt-auto">
                      <div className="text-xl font-black text-foreground font-heading">₹{item.price?.toLocaleString()}</div>
                      <div className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300 flex items-center">
                        View <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
