import winston from 'winston'

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

export const log = {
  info: (message: string | Record<string, any>) => logger.info(message),
  error: (message: string | Record<string, any>) => logger.error(message),
  warn: (message: string | Record<string, any>) => logger.warn(message),
  debug: (message: string | Record<string, any>) => logger.debug(message)
}

export const stream = {
  write: (message: string) => {
    logger.info(message.trim())
  }
}


